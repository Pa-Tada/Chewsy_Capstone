
  const users = [
    {
      userId: 1,
      firstName: "Pete",
      lastName: "Davidson",
      email: "petedavidson@snl.com",
      imgUrl:
        "https://static01.nyt.com/images/2018/12/16/world/16xp-davidson1/merlin_146914890_3e2b450f-94bf-472f-b717-a7b8b4004b1a-superJumbo.jpg",
      rating: 4,
      foodGenre: "Italian",
      affordability: 4,
    },
    {
      userId: 2,
      firstName: "Olivia",
      lastName: "Rodrigo",
      email: "oliviarodrigo@gmail.com",
      imgUrl:
        "https://people.com/thmb/dv8KhUNc3TKeFQomQQK_ED3k4tA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(719x289:721x291)/Olivia-Rodrigo-fdf97f03ad6b4b94a178c3d6088b7308.jpg",
      rating: 4,
      foodGenre: "Thai",
      affordability: 3,
    },
    {
      userId: 3,
      firstName: "Charles",
      lastName: "Barkely",
      email: "iAmRich@aol.com",
      imgUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/1_charles_barkley_2019_%28cropped%29.jpg/1200px-1_charles_barkley_2019_%28cropped%29.jpg",
      rating: 4,
      foodGenre: "American",
      affordability: 2,
    },
    {
      userId: 4,
      firstName: "Wanda",
      lastName: "Sykes",
      email: "wandaSYKES@yahoo.com",
      imgUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlhhuFmKXC41WL4-MVoLkxg_8ZdO38ab4txZ3v9vGTgm46Hv4tyAsUI20&s",
      rating: 5,
      foodGenre: "Chinese",
      affordability: 3,
    },
    {
      id: 5,
      firstName: "Captain",
      lastName: "America",
      imgUrl:
        "https://c8.alamy.com/comp/CPNCC5/captain-america-the-first-avenger-CPNCC5.jpg",
        rating: 5,
        foodGenre: "Chinese",
        affordability: 3,
    },
    {
      id: 6,
      firstName: "Larry",
      lastName: "David",
      imgUrl:
        "https://c8.alamy.com/comp/2HYCH09/larry-david-attending-the-natural-resources-defense-councils-stand-up!-event-at-the-wallis-annenberg-center-for-the-performing-arts-2HYCH09.jpg",
        rating: 4,
        foodGenre: "Italian",
        affordability: 4,
    },
  ];

  const groups = [
    {
      id: 1,
      name: "pete's group",
    },
    { id: 2, name: "Wanda and olivia's group" },
    {
      id: 3,
      name: "Charles' group",
    },
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
      groupId: 2,
      userId: 2,
      isLeader: false,
    },
    {
      groupId: 2,
      userId: 4,
      isLeader: true,
    },
    {
      groupId: 3,
      userId: 3,
      isLeader: true,
    },
    {
      groupId: 3,
      userId: 1,
      isLeader: false,
    },
  ];

  const events = [
    {
      groupId: 1,
      restaurantName: "awesome restaurant",
      restaurantLocation: "new york, new york",
      restaurantImgUrl:
      "https://static01.nyt.com/images/2018/12/16/world/16xp-davidson1/merlin_146914890_3e2b450f-94bf-472f-b717-a7b8b4004b1a-superJumbo.jpg",
      submissions: 4,
    },
    {
      groupId: 2,
      restaurantName: "awesome restaurant 2",
      restaurantLocation: "new york, new york",
      restaurantImgUrl:
      "https://static01.nyt.com/images/2018/12/16/world/16xp-davidson1/merlin_146914890_3e2b450f-94bf-472f-b717-a7b8b4004b1a-superJumbo.jpg",
      submissions: 2,
    },
  ];
