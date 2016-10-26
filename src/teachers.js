module.exports = JSON.stringify([
    require('./pug/teacher-1.pug')({
        photo: "https://pp.vk.me/c626622/v626622721/30647/RZ8g2Ti823k.jpg"
    }),
    require('./pug/teacher-2.pug')({
        photo: require('./images/actor-2.png')
    }),
    require('./pug/teacher-3.pug')({
        photo: require('./images/actor-3.jpg')
    })    
]);
