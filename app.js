var express = require('express');
var path = require('path');
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var _ = require('underscore');
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();

var Movie = require('./models/movie');

mongoose.connect('mongodb://localhost/collective');

app.set('views', 'views/pages');
app.set('view engine', 'jade');
app.locals.pretty = true;
app.listen(port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.static(path.join(__dirname, "public")));

console.log('imooc started.');

app.get('/', function(req, res) {
    Movie.fetch(function(err, movies) {
        if(err) {
            console.log(err);
        }
        res.render('index', {
            title: 'deuso index',
            movies: movies
        });
    });
});

app.get('/movie/:id', function(req, res) {
    var id = req.params.id;
    console.log(id);
    Movie.findById(id, function(err, movie) {
        res.render('detail', {
            title: 'Detail of ' + movie.title,
            movie: movie
        });
    });
});

app.get('/admin/update/:id', function(req, res) {
    var id = req.params.id;

    if(id) {
        Movie.findById(id, function(err, movie) {
            res.render('admin', {
                title: 'deuso update',
                movie: movie
            });
        });
    } else {

    }
});

app.post('/admin/movie/new', function(req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;

    if(id !== 'undefined') {
        Movie.findById(id, function(err, movie) {
            if(err) {
                console.log(err);
            }
            _movie = _.extend(movie, movieObj);
            _movie.save(function(err, movie) {
                if(err) {
                    console.log(err);
                }

                res.redirect('/movie/' + movie._id);
            });
        });
    } else {
        _movie = new Movie({
            title: movieObj.title,
            director: movieObj.director,
            country: movieObj.country,
            year: movieObj.year,
            poster: movieObj.poster,
            flash: movieObj.flash,
            summary: movieObj.summary,
            language: movieObj.language
        });
        _movie.save(function(err, movie) {
            if(err) {
                console.log(err);
            }

            res.redirect('/movie/' + movie._id);
        });
    }
});


app.get('/admin/list', function(req, res) {
    Movie.fetch(function(err, movies) {
        if(err) {
            console.log(err);
        }
        res.render('list', {
            title: 'deuso list',
            movies: movies
        });
    });
});

app.delete('/admin/list', function(req, res) {
    var id = req.query.id;
    if(id) {
        Movie.remove({_id: id}, function(err, movie) {
            if(err) {
                console.log(err)
            } else {
                res.json({success: 1})
            }
        })
    }
})

app.get('/admin/movie', function(req, res) {
    res.render('admin', {
        title: 'deuso admin',
        movie: {
            title: '',
            director: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    });
});

// movies: [{
//             title: '机械战警',
//             _id: 1,
//             poster: 'http://r3.ykimg.com/050E0000530EEB63675839160D0B79D5'
//         },{
//             title: '机械战警',
//             _id: 2,
//             poster: 'http://r3.ykimg.com/050E0000530EEB63675839160D0B79D5'
//         },{
//             title: '机械战警',
//             _id: 3,
//             poster: 'http://r3.ykimg.com/050E0000530EEB63675839160D0B79D5'
//         },{
//             title: '机械战警',
//             _id: 4,
//             poster: 'http://r3.ykimg.com/050E0000530EEB63675839160D0B79D5'
//         },{
//             title: '机械战警',
//             _id: 5,
//             poster: 'http://r3.ykimg.com/050E0000530EEB63675839160D0B79D5'
//         },{
//             title: '机械战警',
//             _id: 6,
//             poster: 'http://r3.ykimg.com/050E0000530EEB63675839160D0B79D5'
//         }]

 // movie: {
 //            title: '机械战警',
 //            director: 'jose padilia',
 //            country: 'US',
 //            year: '2014',
 //            poster: 'http://r3.ykimg.com/050E0000530EEB63675839160D0B79D5',
 //            flash: 'http://player.youku.com/player.php/sid/XNjYyMzkxNjU2/v.swf',
 //            summary: '2028年，专事军火开发的机器人公司Omni Corp.生产了大量装备精良的机械战警，他们被投入到维和和惩治犯罪等行动中，取得显著的效果。罪犯横行的底特律市，嫉恶如仇、正义感十足的警察亚历克斯·墨菲（乔尔·金纳曼 饰）遭到仇家暗算，身体受到毁灭性破坏。借助于Omni公司天才博士丹尼特·诺顿（加里·奥德曼 饰）最前沿的技术，墨菲以机械战警的形态复活。数轮严格的测试表明，墨菲足以承担起维护社会治安的重任，他的口碑在民众中直线飙升，而墨菲的妻子克拉拉（艾比·考尼什 饰）和儿子大卫却再难从他身上感觉亲人的温暖。感知到妻儿的痛苦，墨菲决心向策划杀害自己的犯罪头子展开反击……',
 //            language: 'English'
 //        }