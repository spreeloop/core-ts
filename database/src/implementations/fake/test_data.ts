export const TestData = {
  users: {
    user_1: {
      firstName: 'Bob',
      lastName: 'Madison',
      photoUrl: '',
      userPhoneNumber: '+237696292947',
      userEmail: 'test@gmail.com',
      userId: 'user_1',
    },
    user_2: {
      firstName: 'Alice',
      lastName: 'Camile',
      photoUrl: '',
      userPhoneNumber: '+237699999999',
      userEmail: 'test@gmail.com',
      userId: 'user_2',
    },
    user_3: {
      firstName: 'Laeticia',
      lastName: 'Gaelle',
      photoUrl: '',
      userPhoneNumber: '+237694265478',
      userEmail: 'laetitiaGaelle@gmail.com',
      userId: 'user_3',
    },
  },
  restaurants: {
    restaurant_1: {
      address: {
        additionalInformation: 'Restaurant at Royal Palace Ancienne Route.',
        city: 'Akwa',
        country: 'Cameroon',
        latitude: 4.053137,
        longitude: 9.698011,
        postalCode: '',
        street: 'Rue Franqueville',
      },
      averageCookingTimeInMinutes: {
        max: 45,
        min: 20,
      },
      brandName: 'The Pot Luck Club',
      contacts: {
        phoneNumbers: ['+23765941866', '+15145735543'],
        socials: {
          linkedIn: [
            'https://www.linkedin.com/company/spreeloop-sarl/?viewAsMember=true',
          ],
        },
        website: 'spreeloop.com',
      },
      cuisineType: ['Continental', 'Cameroonian', 'Italian'],
      description: 'Restaurant with lot of pots at Royal Palace.',
      images: {
        bannerPath: 'le_grilladin_res.png',
        previewsPath: ['le_grilladin_res.png'],
        thumbPath: 'le_grilladin_res.png',
      },
      managersIds: ['/users/user_1'],
      numberOfReviews: 2,
      orderOptions: ['takeAway', 'dineIn', 'delivery'],
      rating: 4.5,
      menuItems: {
        menuItem_1: {
          cookingTimeInMinutes: { max: 25, min: 15 },
          foodName: 'Beignet Haricot Bouillie',
          shortDescription:
            'Banana flour, served with beans and a very nutritious white soup.',
          foodType: 'Cameroon',
          numberOfPerson: 1,
          priceInXAF: 250,
          packageFee: 250,
          isVegetarian: true,
          isAvailable: false,
        },
        menuItem_2: {
          cookingTimeInMinutes: { max: 35, min: 20 },
          foodName: 'Legumes Saute',
          shortDescription:
            'Cooked with no salt. Options of tofu, porc, beef, and chicken available.',
          foodType: 'Cameroon',
          imagePath: 'legume_saute.jpg',
          numberOfPerson: 2,
          priceInXAF: 1000,
          packageFee: 350,
          isVegetarian: false,
          isAvailable: true,
        },
        menuItem_3: {
          cookingTimeInMinutes: { max: 15, min: 30 },
          foodName: 'Salades',
          shortDescription: 'Gluten free.',
          foodType: 'Cameroonian',
          imagePath: 'salads.jpg',
          numberOfPerson: 1,
          priceInXAF: 700,
          packageFee: 500,
          isVegetarian: false,
          isAvailable: true,
        },
      },
      reviews: {
        reviews_1: {
          note: 5,
          review: 'Good restaurant',
          userPath: '/users/user_2',
        },
        reviews_2: {
          note: 4,
          review: 'Good restaurant',
          userPath: '/users/user_1',
        },
      },
      openingTimes: {
        openingDay: [
          {
            day: 2,
            openingPeriods: [
              {
                openTimeInUTC: { hour: 9, minute: 0 },
                closeTimeInUTC: { hour: 19, minute: 30 },
              },
            ],
          },
          {
            day: 3,
            openingPeriods: [
              {
                openTimeInUTC: { hour: 9, minute: 0 },
                closeTimeInUTC: { hour: 19, minute: 30 },
              },
            ],
          },
          {
            day: 4,
            openingPeriods: [
              {
                openTimeInUTC: { hour: 9, minute: 0 },
                closeTimeInUTC: { hour: 19, minute: 30 },
              },
            ],
          },
          {
            day: 5,
            openingPeriods: [
              {
                openTimeInUTC: { hour: 9, minute: 0 },
                closeTimeInUTC: { hour: 19, minute: 30 },
              },
            ],
          },
          {
            day: 6,
            openingPeriods: [
              {
                openTimeInUTC: { hour: 9, minute: 0 },
                closeTimeInUTC: { hour: 19, minute: 30 },
              },
            ],
          },
          {
            day: 7,
            openingPeriods: [
              {
                openTimeInUTC: { hour: 9, minute: 0 },
                closeTimeInUTC: { hour: 19, minute: 30 },
              },
            ],
          },
        ],
      },
      isActive: true,
    },
    restaurant_2: {
      openingTimes: {
        openingDay: [
          {
            day: 2,
            openingPeriods: [
              {
                openTimeInUTC: { hour: 9, minute: 0 },
                closeTimeInUTC: { hour: 19, minute: 30 },
              },
            ],
          },
          {
            day: 3,
            openingPeriods: [
              {
                openTimeInUTC: { hour: 9, minute: 0 },
                closeTimeInUTC: { hour: 19, minute: 30 },
              },
            ],
          },
          {
            day: 4,
            openingPeriods: [
              {
                openTimeInUTC: { hour: 9, minute: 0 },
                closeTimeInUTC: { hour: 19, minute: 30 },
              },
            ],
          },
          {
            day: 5,
            openingPeriods: [
              {
                openTimeInUTC: { hour: 9, minute: 0 },
                closeTimeInUTC: { hour: 19, minute: 30 },
              },
            ],
          },
          {
            day: 6,
            openingPeriods: [
              {
                openTimeInUTC: { hour: 9, minute: 0 },
                closeTimeInUTC: { hour: 19, minute: 30 },
              },
            ],
          },
          {
            day: 7,
            openingPeriods: [
              {
                openTimeInUTC: { hour: 9, minute: 0 },
                closeTimeInUTC: { hour: 19, minute: 30 },
              },
            ],
          },
        ],
      },
      address: {
        additionalInformation: '',
        city: 'Bastos',
        country: 'Cameroon',
        latitude: 3.88701,
        longitude: 11.50396,
        postalCode: '',
        street: 'Nv Rte Bastos',
      },
      averageCookingTimeInMinutes: {
        max: 30,
        min: 20,
      },
      brandName: 'Italian Dream',
      contacts: {
        phoneNumbers: ['+23765941866', '+15145735543'],
        socials: {
          facebook: ['https://www.facebook.com/spreeloop-sarl'],
        },
        website: 'spreeloop.com',
      },
      cuisineType: ['Italian'],
      description: 'Restaurant with good pizza',
      images: {
        bannerPath: 'link.jpg',
        previewsPath: ['link.jpg'],
        thumbPath: 'link.jpg',
      },
      managersIds: ['users/user_1'],
      numberOfReviews: 2,
      orderOptions: ['dineIn'],
      rating: 3.8,
      menuItems: {
        menuItem_1: {
          cookingTimeInMinutes: { max: 25, min: 15 },
          foodName: 'Beignet Haricot Bouillie',
          shortDescription:
            'Baked without oil. Served with plantains, fries or bread.',
          foodType: 'Cameroon',
          imagePath: 'bhb.jpg',
          numberOfPerson: 1,
          priceInXAF: 250,
          packageFee: 0,
          isVegetarian: true,
          isAvailable: false,
        },
        menuItem_2: {
          cookingTimeInMinutes: { max: 35, min: 20 },
          foodName: 'Mouton grille',
          shortDescription:
            'Cooked with no salt. Served with plantains, fries or bread.',
          foodType: 'Cameroon',
          imagePath: 'mouton_grille.jpg',
          numberOfPerson: 2,
          priceInXAF: 4500,
          packageFee: 0,
          isVegetarian: false,
          isAvailable: true,
        },
      },
      reviews: {
        reviews_1: {
          note: 4,
          review: 'Good restaurant',
          userPath: '/users/user_2',
        },
        reviews_2: {
          note: 2,
          review: 'Too bad',
          userPath: '/users/user_1',
        },
      },
      isActive: true,
    },
    restaurant_3: {
      openingTimes: {
        openingDay: [
          {
            day: 4,
            openingPeriods: [
              {
                openTimeInUTC: { hour: 9, minute: 0 },
                closeTimeInUTC: { hour: 19, minute: 30 },
              },
            ],
          },
          {
            day: 5,
            openingPeriods: [
              {
                openTimeInUTC: { hour: 9, minute: 0 },
                closeTimeInUTC: { hour: 19, minute: 30 },
              },
            ],
          },
          {
            day: 6,
            openingPeriods: [
              {
                openTimeInUTC: { hour: 9, minute: 0 },
                closeTimeInUTC: { hour: 19, minute: 30 },
              },
            ],
          },
          {
            day: 7,
            openingPeriods: [
              {
                openTimeInUTC: { hour: 9, minute: 0 },
                closeTimeInUTC: { hour: 19, minute: 30 },
              },
            ],
          },
        ],
      },
      address: {
        additionalInformation: "En face de l'olympia",
        city: 'Yaoundé',
        country: 'Cameroon',
        latitude: 4.28701,
        longitude: 11.50396,
        postalCode: '',
        street: 'Mendong - Montee jouvance',
      },
      averageCookingTimeInMinutes: {
        max: 30,
        min: 20,
      },
      brandName: 'Black Sheep Restaurant',
      contacts: {
        phoneNumbers: ['+23765941866', '+15145735543'],
        socials: {
          facebook: ['https://www.facebook.com/spreeloop-sarl'],
        },
        website: 'spreeloop.com',
      },
      cuisineType: ['British'],
      description: 'Restaurant with good pizza',
      images: {
        bannerPath: 'link.jpg',
        previewsPath: ['link.jpg'],
        thumbPath: 'link.jpg',
      },
      managersIds: ['users/user_1'],
      numberOfReviews: 2,
      orderOptions: ['takeAway', 'delivery'],
      rating: 2.8,
      menuItemAddOns: {
        menuItemAddOn_1: {
          itemName: 'Medium Pan (26 cm - 6 parts)',
          additionalPriceInXAF: 1500,
          isAvailable: true,
        },
        menuItemAddOn_2: {
          itemName: 'Medium Classic (30 cm - 6 parts)',
          additionalPriceInXAF: 2500,
          isAvailable: true,
        },
        menuItemAddOn_3: {
          itemName: 'XL Pan (33 cm - 8 parts)',
          additionalPriceInXAF: 3500,
          isAvailable: true,
        },
        menuItemAddOn_4: {
          itemName: 'pomme frite',
          additionalPriceInXAF: 0,
          isAvailable: true,
        },
        menuItemAddOn_5: {
          itemName: 'plantain frite',
          additionalPriceInXAF: 0,
          isAvailable: true,
        },
        menuItemAddOn_6: {
          itemName: 'Pigment',
          additionalPriceInXAF: 0,
          isAvailable: false,
        },
        menuItemAddOn_7: {
          itemName: 'Sauce Tomate',
          additionalPriceInXAF: 0,
          isAvailable: true,
        },
        menuItemAddOn_8: {
          itemName: 'Mayonnaise',
          additionalPriceInXAF: 200,
          isAvailable: true,
        },
        menuItemAddOn_9: {
          itemName: 'Pizza marguerite',
          additionalPriceInXAF: 0,
          isAvailable: true,
        },
        menuItemAddOn_10: {
          itemName: 'Pizza végétarienne',
          additionalPriceInXAF: 0,
          isAvailable: false,
        },
        menuItemAddOn_11: {
          itemName: 'Pizza soufflée',
          additionalPriceInXAF: 0,
          isAvailable: true,
        },
        menuItemAddOn_12: {
          itemName: 'Macabo',
          additionalPriceInXAF: 200,
          isAvailable: true,
        },
        menuItemAddOn_13: {
          itemName: 'Manioc',
          additionalPriceInXAF: 100,
          isAvailable: false,
        },
        menuItemAddOn_14: {
          itemName: 'Sucre',
          additionalPriceInXAF: 0,
          isAvailable: true,
        },
        menuItemAddOn_15: {
          itemName: "O'kok s'en sel",
          additionalPriceInXAF: 1500,
          isAvailable: true,
        },
        menuItemAddOn_16: {
          itemName: "O'kok avec sel",
          additionalPriceInXAF: 2000,
          isAvailable: true,
        },
      },
      menuItems: {
        menuItem_1: {
          cookingTimeInMinutes: {
            max: 25,
            min: 15,
          },
          foodName: 'Pizza',
          foodType: 'Cameroon',
          imagePath: 'brochettes.jpg',
          numberOfPerson: 1,
          priceInXAF: 1000,
          packageFee: 500,
          isVegetarian: true,
          isAvailable: true,
          addOnGroups: {
            addOnGroup_1: {
              description: 'Taille de la pate',
              required: true,
              multiSelect: false,
              addOnItems: {
                addOnItem_1: {
                  additionalPriceInXAF: null,
                  isAvailable: true,
                  menuItemAddOnId: 'menuItemAddOn_1',
                },
              },
            },
            addOnGroup_2: {
              description: 'Complement',
              required: false,
              multiSelect: false,
              addOnItems: {
                addOnItem_4: {
                  additionalPriceInXAF: null,
                  isAvailable: true,
                  menuItemAddOnId: 'menuItemAddOn_4',
                },
                addOnItem_5: {
                  additionalPriceInXAF: 0,
                  isAvailable: true,
                  menuItemAddOnId: 'menuItemAddOn_5',
                },
              },
            },
            addOnGroup_3: {
              description: 'Supplement',
              required: false,
              multiSelect: true,
              addOnItems: {
                addOnItem_6: {
                  additionalPriceInXAF: 0,
                  isAvailable: false,
                  menuItemAddOnId: 'menuItemAddOn_6',
                },
                addOnItem_7: {
                  additionalPriceInXAF: 0,
                  menuItemAddOnId: 'menuItemAddOn_7',
                  isAvailable: true,
                },
                addOnItem_8: {
                  menuItemAddOnId: 'menuItemAddOn_8',
                  additionalPriceInXAF: 200,
                  isAvailable: true,
                },
              },
            },
            addOnGroup_4: {
              description: 'Variete de pizza',
              required: true,
              multiSelect: false,
              addOnItems: {
                addOnItem_9: {
                  additionalPriceInXAF: 0,
                  menuItemAddOnId: 'menuItemAddOn_9',
                  isAvailable: true,
                },
                addOnItem_10: {
                  additionalPriceInXAF: 0,
                  menuItemAddOnId: 'menuItemAddOn_10',
                  isAvailable: true,
                },
                addOnItem_11: {
                  additionalPriceInXAF: 0,
                  menuItemAddOnId: 'menuItemAddOn_11',
                  isAvailable: false,
                },
              },
            },
          },
        },
        menuItem_2: {
          cookingTimeInMinutes: { max: 35, min: 20 },
          foodName: "O'kok",
          foodType: 'Cameroon',
          imagePath: 'okok.jpg',
          numberOfPerson: 2,
          priceInXAF: 1050,
          packageFee: 500,
          isVegetarian: false,
          isAvailable: true,
          addOnGroups: {
            addOnGroup_1: {
              description: 'Complement',
              required: false,
              multiSelect: false,
              addOnItems: {
                addOnItem_13: {
                  additionalPriceInXAF: 400,
                  menuItemAddOnId: 'menuItemAddOn_13',
                  isAvailable: false,
                },
                addOnItem_12: {
                  additionalPriceInXAF: 100,
                  menuItemAddOnId: 'menuItemAddOn_12',
                  isAvailable: true,
                },
              },
            },
            addOnGroup_2: {
              description: 'Supplement',
              required: false,
              multiSelect: true,
              addOnItems: {
                addOnItem_6: {
                  menuItemAddOnId: 'menuItemAddOn_6',
                  additionalPriceInXAF: null,
                  isAvailable: false,
                },
                addOnItem_14: {
                  menuItemAddOnId: 'menuItemAddOn_14',
                  additionalPriceInXAF: 0,
                  isAvailable: true,
                },
              },
            },
            addOnGroup_3: {
              description: "Variete d' O'kok",
              required: true,
              multiSelect: false,
              addOnItems: {
                addOnItem_15: {
                  menuItemAddOnId: 'menuItemAddOn_15',
                  additionalPriceInXAF: null,
                  isAvailable: true,
                },
                addOnItem_16: {
                  menuItemAddOnId: 'menuItemAddOn_16',
                  additionalPriceInXAF: null,
                  isAvailable: true,
                },
              },
            },
          },
        },
        menuItem_3: {
          cookingTimeInMinutes: { max: 25, min: 15 },
          foodName: 'Beignet Haricot Bouillie',
          shortDescription:
            'Banana flour, served with beans and a very nutritious white soup.',
          foodType: 'Cameroon',
          numberOfPerson: 1,
          priceInXAF: 250,
          packageFee: 400,
          isVegetarian: true,
          isAvailable: false,
        },
        menuItem_4: {
          cookingTimeInMinutes: { max: 35, min: 20 },
          foodName: 'Legumes Saute',
          shortDescription:
            'Cooked with no salt. Options of tofu, porc, beef, and chicken available.',
          foodType: 'Cameroon',
          imagePath: 'legume_saute.jpg',
          numberOfPerson: 2,
          priceInXAF: 1000,
          packageFee: 250,
          isVegetarian: false,
          isAvailable: true,
        },
      },
      reviews: {
        reviews_1: {
          note: 4,
          review: 'Good restaurant',
          userPath: '/users/user_2',
        },
        reviews_2: {
          note: 2,
          review: 'Too bad',
          userPath: '/users/user_1',
        },
      },
      isActive: true,
    },
    restaurant_4: {
      openingTimes: {
        openingDay: [
          {
            day: 5,
            openingPeriods: [
              {
                openTimeInUTC: { hour: 9, minute: 0 },
                closeTimeInUTC: { hour: 19, minute: 30 },
              },
            ],
          },
          {
            day: 6,
            openingPeriods: [
              {
                openTimeInUTC: { hour: 9, minute: 0 },
                closeTimeInUTC: { hour: 19, minute: 30 },
              },
            ],
          },
          {
            day: 7,
            openingPeriods: [
              {
                openTimeInUTC: { hour: 9, minute: 0 },
                closeTimeInUTC: { hour: 19, minute: 30 },
              },
            ],
          },
        ],
      },
      address: {
        additionalInformation: 'Tchopetyamo, Yaoundé.',
        city: 'Yaounde',
        country: 'Cameroon',
        latitude: 3.887451,
        longitude: 11.502785,
        postalCode: 'Yaoundé BP 10073, Cameroon',
        street: 'Quartier Bastos',
      },
      averageCookingTimeInMinutes: {
        max: 45,
        min: 20,
      },
      brandName: 'Tchopetyamob',
      contacts: {
        phoneNumbers: ['+237656415639'],
        socials: {
          facebook: ['https://www.facebook.com/tchopetyamo'],
        },
        website: 'https://www.tchopetyamo.com/firstTime/',
      },
      cuisineType: ['Continental', 'Cameroonian', 'Italian'],
      description: 'Beignets et Haricots.',
      images: {
        bannerPath: 'le_grilladin_res.png',
        previewsPath: ['le_grilladin_res.png'],
        thumbPath: 'le_grilladin_res.png',
      },
      managersIds: ['/users/user_1'],
      numberOfReviews: 2,
      orderOptions: ['takeAway', 'dineIn', 'delivery'],
      rating: 3.0,
      menuItems: {
        menuItem_1: {
          cookingTimeInMinutes: { max: 25, min: 15 },
          foodName: 'Beignet Haricot Bouillie',
          shortDescription:
            'Cooked with no salt. Served with plantains, fries or bread.',
          foodType: 'Cameroon',
          imagePath: 'bhb.jpg',
          numberOfPerson: 1,
          priceInXAF: 250,
          packageFee: 350,
          isVegetarian: true,
          isAvailable: true,
        },
        menuItem_2: {
          cookingTimeInMinutes: { max: 35, min: 20 },
          foodName: 'Legumes Saute',
          shortDescription:
            'Cooked with no salt. Served with plantains, fries or bread.',
          foodType: 'Cameroon',
          imagePath: 'legume_saute.jpg',
          numberOfPerson: 2,
          priceInXAF: 1000,
          packageFee: 500,
          isVegetarian: false,
          isAvailable: true,
        },
        menuItem_3: {
          cookingTimeInMinutes: { max: 15, min: 30 },
          foodName: 'Salades',
          shortDescription:
            'Cooked with no salt. Served with plantains, fries or bread.',
          foodType: 'Cameroonian',
          imagePath: 'salads.jpg',
          numberOfPerson: 1,
          priceInXAF: 700,
          packageFee: 150,
          isVegetarian: false,
          isAvailable: true,
        },
      },
      reviews: {
        reviews_1: {
          note: 5,
          review: 'Good restaurant',
          userPath: '/users/user_2',
        },
        reviews_2: {
          note: 4,
          review: 'Good restaurant',
          userPath: '/users/user_1',
        },
      },
      isActive: true,
    },
    restaurant_5: {
      openingTimes: {
        openingDay: [
          {
            day: 1,
            openingPeriods: [
              {
                openTimeInUTC: { hour: 9, minute: 0 },
                closeTimeInUTC: { hour: 19, minute: 30 },
              },
            ],
          },
          {
            day: 7,
            openingPeriods: [
              {
                openTimeInUTC: { hour: 9, minute: 0 },
                closeTimeInUTC: { hour: 19, minute: 30 },
              },
            ],
          },
        ],
      },
      address: {
        additionalInformation: 'Nv Rte Bastos, Yaoundé, Cameroon.',
        city: 'Yaounde',
        country: 'Cameroon',
        latitude: 3.8379,
        longitude: 11.516675,
        postalCode: '',
        street: 'Nv Rte Bastos',
      },
      averageCookingTimeInMinutes: {
        max: 45,
        min: 20,
      },
      brandName: 'Socrat Restaurant',
      contacts: {
        phoneNumbers: ['+2390040404'],
        socials: {
          facebook: [
            'https://www.facebook.com/Socrat-Restaurant-175143009346484',
          ],
        },
        website: 'https://www.socratrestaurant.com/contacts.php',
      },
      cuisineType: ['Continental', 'Cameroonian', 'Italian'],
      description: 'Beignets et Haricots.',
      images: {
        bannerPath: 'le_grilladin_res.png',
        previewsPath: ['le_grilladin_res.png'],
        thumbPath: 'le_grilladin_res.png',
      },
      managersIds: ['/users/user_1'],
      numberOfReviews: 2,
      orderOptions: ['takeAway', 'dineIn', 'delivery'],
      rating: 3.0,
      menuItems: {
        menuItem_1: {
          cookingTimeInMinutes: { max: 25, min: 15 },
          foodName: 'Beignet Haricot Bouillie',
          shortDescription:
            'Cooked with no salt. Served with plantains, fries or bread.',
          foodType: 'Cameroon',
          imagePath: 'bhb.jpg',
          numberOfPerson: 1,
          priceInXAF: 250,
          packageFee: 200,
          isVegetarian: true,
          isAvailable: true,
        },
        menuItem_2: {
          cookingTimeInMinutes: { max: 35, min: 20 },
          foodName: 'Legumes Saute',
          shortDescription:
            'Cooked with no salt. Served with plantains, fries or bread.',
          foodType: 'Cameroon',
          imagePath: 'legume_saute.jpg',
          numberOfPerson: 2,
          priceInXAF: 1000,
          packageFee: 150,
          isVegetarian: false,
          isAvailable: false,
        },
        menuItem_3: {
          cookingTimeInMinutes: { max: 15, min: 30 },
          foodName: 'Salades',
          shortDescription:
            'Cooked with no salt. Served with plantains, fries or bread.',
          foodType: 'Cameroonian',
          imagePath: 'salads.jpg',
          numberOfPerson: 1,
          priceInXAF: 700,
          packageFee: 450,
          isVegetarian: false,
          isAvailable: true,
        },
      },
      reviews: {
        reviews_1: {
          note: 5,
          review: 'Good restaurant',
          userPath: '/users/user_2',
        },
        reviews_2: {
          note: 4,
          review: 'Good restaurant',
          userPath: '/users/user_1',
        },
      },
      isActive: true,
    },
    restaurant_6: {
      address: {
        additionalInformation: 'Monte cradat',
        city: 'Yaoundé',
        country: 'Cameroon',
        latitude: 3.824331,
        longitude: 11.516417,
        postalCode: '',
        street: 'Joseph Tchooungui Akoa',
      },
      averageCookingTimeInMinutes: {
        max: 30,
        min: 20,
      },
      brandName: 'Snap Burger',
      contacts: {
        phoneNumbers: ['+237697701957'],
        socials: {
          facebook: ['https://www.facebook.com/snapburger17'],
        },
        website: 'spreeloop.com',
      },
      cuisineType: ['British'],
      description: 'Restaurant with good Burgers',
      images: {
        bannerPath: 'link.jpg',
        previewsPath: ['link.jpg'],
        thumbPath: 'link.jpg',
      },
      managersIds: ['users/user_1'],
      numberOfReviews: 2,
      orderOptions: ['takeAway', 'delivery'],
      rating: 2.8,
      menuItems: {
        menuItem_1: {
          cookingTimeInMinutes: { max: 25, min: 15 },
          foodName: 'Brochettes de boeufs',
          shortDescription:
            'Cooked with no salt. Served with plantains, fries or bread.',
          foodType: 'Cameroon',
          imagePath: 'brochettes.jpg',
          numberOfPerson: 1,
          priceInXAF: 1000,
          packageFee: 250,
          isVegetarian: true,
          isAvailable: true,
        },
        menuItem_2: {
          cookingTimeInMinutes: { max: 35, min: 20 },
          foodName: "O'kok",
          shortDescription:
            'Cooked with no salt. Served with plantains, fries or bread.',
          foodType: 'Cameroon',
          imagePath: 'okok.jpg',
          numberOfPerson: 2,
          priceInXAF: 1050,
          packageFee: 450,
          isVegetarian: false,
          isAvailable: true,
        },
      },
      reviews: {
        reviews_1: {
          note: 4,
          review: 'Good restaurant',
          userPath: '/users/user_2',
        },
        reviews_2: {
          note: 2,
          review: 'Too bad',
          userPath: '/users/user_1',
        },
      },
      isActive: true,
    },
  },
  promotions: {
    promotion_1: {
      appliesOn: 'deliveryFee',
      createdAt: '2021-10-01T12:30:29.897Z',
      creatorPath: '03HbM5T37VQrnGcWXdOF/tKb5tlVbNkWm4chTNaTMR5LLhkt2',
      discount: 25,
      discountType: 'PERCENTAGE',
      isActive: true,
      maxUsageCount: 10,
      minAmountToSpend: 5000,
      menuItemsPaths: null,
      placesPaths: [
        'restaurants/restaurant_1',
        'restaurants/restaurant_2',
        'restaurants/restaurant_3',
        'restaurants/restaurant_4',
        'restaurants/restaurant_5',
        'restaurants/restaurant_6',
      ],
      promoCode: 'CMR237',
      subscriberCount: {
        user_1: {
          numberOfUse: 2,
        },
        user_2: {
          numberOfUse: 5,
        },
      },
      subscribers: {
        user_1: {},
        user_2: {},
      },
    },
    promotion_2: {
      appliesOn: 'itemPrice',
      createdAt: '2021-10-01T12:30:29.897Z',
      creatorPath: '03HbM5T37VQrnGcWXdOF/tKb5tlVbNkWm4chTNaTMR5LLhkt2',
      discount: 2500,
      discountType: 'VALUE_IN_XAF',
      isActive: false,
      maxUsageCount: 10,
      minAmountToSpend: 5000,
      menuItemsPaths: null,
      placesPaths: [
        'restaurants/restaurant_1',
        'restaurants/restaurant_2',
        'restaurants/restaurant_3',
        'restaurants/restaurant_4',
        'restaurants/restaurant_5',
        'restaurants/restaurant_6',
      ],
      promoCode: 'INACTIVE_PROMO',
      subscriberCount: {
        user_1: {
          numberOfUse: 2,
        },
        user_2: {
          numberOfUse: 5,
        },
      },
      subscribers: {
        user_1: {},
        user_2: {},
      },
    },
    promotion_3: {
      appliesOn: 'itemPrice',
      createdAt: '2021-10-01T12:30:29.897Z',
      creatorPath: '03HbM5T37VQrnGcWXdOF/tKb5tlVbNkWm4chTNaTMR5LLhkt2',
      discount: 25,
      discountType: 'PERCENTAGE',
      isActive: true,
      maxUsageCount: 10,
      minAmountToSpend: 5000,
      menuItemsPaths: null,
      placesPaths: ['restaurants/restaurant_6'],
      promoCode: 'INVALID_RESTAURANT',
      subscriberCount: {
        user_1: {
          numberOfUse: 2,
        },
        user_2: {
          numberOfUse: 5,
        },
      },
      subscribers: {
        user_1: {},
        user_2: {},
      },
    },
  },
};
