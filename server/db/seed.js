const {
  db,
  models: { User, Group, UserGroup, Event },
} = require("../db");

async function seed() {
  await db.sync({ force: true }); // clears db and matches models to tables
  console.log("db synced!");

  const users = [
    {
      userId: 1,
      firstName: "Pete",
      lastName: "Davidson",
      email: "petedavidson@snl.com",
      imgUrl:
        "https://static01.nyt.com/images/2018/12/16/world/16xp-davidson1/merlin_146914890_3e2b450f-94bf-472f-b717-a7b8b4004b1a-superJumbo.jpg",
      rating: 4, // are we rating our of 10?
      foodGenre: "Italian",
      affordability: 4, // are we rating out of 4?
    },
    {
      userId: 2,
      firstName: "Olivia",
      lastName: "Rodrigo",
      email: "oliviarodrigo@gmail.com",
      imgUrl:
        "https://people.com/thmb/dv8KhUNc3TKeFQomQQK_ED3k4tA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(719x289:721x291)/Olivia-Rodrigo-fdf97f03ad6b4b94a178c3d6088b7308.jpg",
      rating: 4, // are we rating our of 10?
      foodGenre: "Thai",
      affordability: 3, // are we rating out of 4?
    },
    {
      userId: 3,
      firstName: "Charles",
      lastName: "Barkely",
      email: "iAmRich@aol.com",
      imgUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/1_charles_barkley_2019_%28cropped%29.jpg/1200px-1_charles_barkley_2019_%28cropped%29.jpg",
      rating: 2, // are we rating our of 10?
      foodGenre: "American",
      affordability: 2, // are we rating out of 4?
    },
    {
      userId: 4,
      firstName: "Wanda",
      lastName: "Sykes",
      email: "wandaSYKES@yahoo.com",
      imgUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlhhuFmKXC41WL4-MVoLkxg_8ZdO38ab4txZ3v9vGTgm46Hv4tyAsUI20&s",
      rating: 5, // are we rating our of 10?
      foodGenre: "Chinese",
      affordability: 3, // are we rating out of 4?
    },
  ];

  const groups = [
    {
      id: 1,
      name: "pete's group",
    },
    { id: 2,
      name: "Wanda and olivia's group" },
  ];
  const userGroups = [
    {
      groupId: 1,
      userId: 1,
      isLeader: true,
    },
    {
      groupId: 1,
      userId: 2,
      isLeader: false,
    },
    {
      groupId: 1,
      userId: 3,
      isLeader: false,
    },
    {
      groupId: 1,
      userId: 4,
      isLeader: false,
    },
    {
      groupId:2,
      userId: 2,
      isLeader: false
    },
    {
      groupId:2,
      userId: 4,
      isLeader: true
    }
  ];

  const events = [
    {
      groupId: 1,
      // restaurantCode: 1,
      restaurantName: "awesome restaurant",
      restaurantLocation: "new york, new york",
      submissions: 4,
    },
    {
      groupId:2,
      // restaurantCode:1,
      restaurantName: "awesome restaurant 2",
      restaurantLocation: "new york, new york",
      submissions:2
    }
  ];

  await Promise.all(
    users.map((currentUser) => {
      return User.create(currentUser);
    })
  );

  await Promise.all(
    groups.map((currentGroup) => {
      return Group.create(currentGroup);
    })
  );

  await Promise.all(
    userGroups.map((currentUserGroup) => {
      return UserGroup.create(currentUserGroup);
    })
  );

  await Promise.all(
    events.map((currentEvent) => {
      return Event.create(currentEvent);
    })
  );

  console.log(`seeded ${users.length} users`);
  console.log(`seeded successfully`);
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
// */
async function runSeed() {
  console.log("seeding...");
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log("closing db connection");
    await db.close();
    console.log("db connection closed");
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/

if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
