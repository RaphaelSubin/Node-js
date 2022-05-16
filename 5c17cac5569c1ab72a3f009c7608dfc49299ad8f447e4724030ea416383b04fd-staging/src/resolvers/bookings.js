import { response } from 'express';
import respObj from '../assets/lang/en.json';

const { authAPI } = respObj;

var Amadeus = require("amadeus");
var amadeus = new Amadeus({
    clientId: 'Rnwo2kxcDoqJnBGGaYUulWjzl6GRIXcC',
    clientSecret: '7tdhEXUQhT4GVuSj'
});

const hotelSearch = async (cityCode, latitude, longitude, checkInDate, checkOutDate, roomQuantity,
    adults, radius, radiusUnit, hotelName, chains, rateCodes, amenities, ratings, priceRange,
    currency, paymentPolicy, boardType, includeClosed, bestRateOnly, sort, lang, resps) => {
    amadeus.shopping.hotelOffers.get({
        cityCode: cityCode,
        latitude: latitude, longitude: longitude, checkInDate: checkInDate, checkOutDate: checkOutDate,
        roomQuantity: roomQuantity, adults: adults, radius: radius, radiusUnit: radiusUnit,
        hotelName: hotelName, chains: chains, rateCodes: rateCodes, amenities: amenities, ratings: ratings,
        priceRange: priceRange, currency: currency, paymentPolicy: paymentPolicy, boardType: boardType,
        includeClosed: includeClosed, bestRateOnly: bestRateOnly, sort: sort, lang: lang
    }).then(function (response) {
        resps(response);
    }).catch(function (response) {
        resps(response.response);
    });
};

const hotelDetails = async (hotelId, resps) => {
    amadeus.shopping.hotelOffersByHotel.get({
        hotelId: hotelId
    }).then(function (response) {
        resps(response);
    }).catch(function (response) {
        resps(response.response);
    });
};


const hotelFinalPrice = async (offerlId, resps) => {
    amadeus.shopping.hotelOffer(offerlId).get()
        .then(function (response) {
            resps(response);
        }).catch(function (response) {
            resps(response.response);
        });
};

const bookHotel = async (offerId, title, firstName, lastName, phone, email,vendorCode, cardNumber, expiryDate, resps) => {
    amadeus.booking.hotelBookings.post(
        JSON.stringify({
            'data': {
                'offerId': offerId,
                'guests': [{
                    'name': {
                        'title': title,
                        'firstName': firstName,
                        'lastName': lastName
                    },
                    'contact': {
                        'phone': phone,
                        'email': email
                    }
                }],
                'payments': [{
                    'method': 'creditCard',
                    'card': {
                        'vendorCode': vendorCode,
                        'cardNumber': cardNumber,
                        'expiryDate': expiryDate
                    }
                }]
            }
        })).then(function (response) {
            console.log(response);
            console.log(response.result.data[0]);
            resps(response);
        }).catch(function (response) {
            console.error(response);
            resps(response.response);
        });
};

export default {
    Query: {
        searchHotels: async (parent, {
            cityCode, latitude, longitude, checkInDate, checkOutDate, roomQuantity,
            adults, radius, radiusUnit, hotelName, chains, rateCodes, amenities, ratings, priceRange,
            currency, paymentPolicy, boardType, includeClosed, bestRateOnly, sort, lang
        }, { models }) => {
            if (cityCode) {

                const promise = new Promise((resolve, reject) => {
                    hotelSearch(cityCode, latitude, longitude, checkInDate, checkOutDate, roomQuantity,
                        adults, radius, radiusUnit, hotelName, chains, rateCodes, amenities, ratings, priceRange,
                        currency, paymentPolicy, boardType, includeClosed, bestRateOnly, sort, lang, (res) => {
                            resolve(res.body);
                        });
                });
                const responseText = await promise;
                const dataresp = JSON.parse(responseText);
                //   console.log(dataresp.data[0].hotel.address);
                const msg = {
                    status: authAPI.success,
                    code: authAPI.codeSuccess,
                    data: dataresp.data,
                };
                console.log(msg);
                return (msg);
            }
            else {
                const msg = {
                    status: authAPI.error,
                    code: authAPI.codeError,
                    message: authAPI.no_data,
                };
                return (msg);
            }


        },

        hotelDetails: async (parent, { hotelId }, { models }) => {
            if (hotelId) {

                const promise = new Promise((resolve, reject) => {
                    hotelDetails(hotelId, (res) => {
                        resolve(res.body);
                    });
                });
                const responseText = await promise;
                const dataresp = JSON.parse(responseText);
                console.log(dataresp.data);
                const msg = {
                    status: authAPI.success,
                    code: authAPI.codeSuccess,
                    data: dataresp.data,
                };
                // console.log(msg);
                return (msg);
            }
            else {
                const msg = {
                    status: authAPI.error,
                    code: authAPI.codeError,
                    message: authAPI.no_data,
                };
                return (msg);
            }


        },

        hotelFinalPrice: async (parent, { offerId }, { models }) => {
            console.log(offerId);
            if (offerId) {

                const promise = new Promise((resolve, reject) => {
                    hotelFinalPrice(offerId, (res) => {
                        resolve(res);
                    });
                });
                const responseText = await promise;
                const dataresp = JSON.parse(responseText.body);
                console.log(dataresp.data);
                const msg = {
                    status: authAPI.success,
                    code: authAPI.codeSuccess,
                    data: dataresp.data,
                };
                return (msg);
            }
            else {
                const msg = {
                    status: authAPI.error,
                    code: authAPI.codeError,
                    message: authAPI.no_data,
                };
                return (msg);
            }


        },

        
    },

    Mutation: {
        bookHotel: async (parent, { offerId, title, firstName, lastName, phone, email,vendorCode, cardNumber, expiryDate }, { models, me }) => {
            if (!me) {
                throw new AuthenticationError(authAPI.invalid_token
                );
            }
            if (offerId) {

                const promise = new Promise((resolve, reject) => {
                    bookHotel(offerId, title, firstName, lastName, phone, email,vendorCode, cardNumber, expiryDate, (res) => {
                        resolve(res);
                    });
                });
                const responseText = await promise;
                const dataresp = JSON.parse(responseText.body);
                if(responseText.statusCode === 201){
                    const hotelId='BRPARVDB';
                    let hotels='';
                    hotels = await models.hotels.findOne({ where: { hotelId: hotelId } });
                    if(!hotels){
                        const promise = new Promise((resolve, reject) => {
                            hotelDetails(hotelId, (res) => {
                                resolve(res.body);
                            });
                        });
    
                        const hotel = await promise;
                        const hotelData = JSON.parse(hotel);
                        const adddress= `Lines: ${hotelData.data.hotel.address.lines[0]}, Postal Code:${hotelData.data.hotel.address.postalCode}, City Name: ${hotelData.data.hotel.address.cityName}, Country Code: ${hotelData.data.hotel.address.countryCode}`;
                        const data = {
                            hotelId: hotelData.data.hotel.hotelId,
                            hotelName: hotelData.data.hotel.name,
                            address: adddress,
                            place: hotelData.data.hotel.address.cityName,
                            phone: hotelData.data.hotel.contact.phone,
                            image: hotelData.data.hotel.media[0].uri,
                            lat: hotelData.data.hotel.latitude,
                            lng: hotelData.data.hotel.longitude,
                        }
                        hotels= await models.hotels.create(data);
                        console.log('created');
                        
                    }
                    const promise = new Promise((resolve, reject) => {
                        hotelFinalPrice(offerId, (res) => {
                            resolve(res);
                        });
                    });
                    const bookingsResponse = await promise;
                    const bookingsResp = JSON.parse(bookingsResponse.body);
                    const bookings={
                        travellersId: me.id,
                        hotelId: hotels.dataValues.id,
                        bookingId: responseText.data[0].id,
                        bookedDate: responseText.headers.date,
                        checkInDate: bookingsResp.data.offers[0].checkInDate,
                        checkOutDate: bookingsResp.data.offers[0].checkOutDate,
                        roomType: bookingsResp.data.offers[0].room.type,
                        orderPrice: bookingsResp.data.offers[0].price.base,
                        totalPrice: bookingsResp.data.offers[0].price.total,
                        tax: Math.abs(bookingsResp.data.offers[0].price.base- bookingsResp.data.offers[0].price.total),
                    }
                    const bookingsData = await models.bookings.create(bookings);
                    const msg = {
                        status: authAPI.success,
                        code: authAPI.codeSuccess,
                        message: responseText.body,
                    };
                    return (msg);
                }
                const msg = {
                    status: dataresp.errors[0].status,
                    code: dataresp.errors[0].code,
                    message: dataresp.errors[0].title,
                };
                return (msg);
            }
            else {
                const msg = {
                    status: authAPI.error,
                    code: authAPI.codeError,
                    message: authAPI.no_data,
                };
                return (msg);
            }


        },

    },


};