var express = require('express');
var router = express.Router();
var sequelize = require('sequelize');
var invokeSDK = require('../fabric/sdk/javascript-sdk/invoke.js');
var querySDK = require('../fabric/sdk/javascript-sdk/query.js');

const { User, Bdcard, Reqboard } = require('../models');

// 헌혈증 등록    main화면에서 헌혈증 등록하러가기 >> 버튼
router.get('/blood_register', function (req, res, next) {
    if(req.user)
      res.render('blood_register_form', Object.assign(req.user, { register: null }));
    else{
      res.render('blood_register_form')
    }

});

// 헌혈증 등록 처리
router.post('/blood_register_do', function (req, res, next) {
  var duplicated = false;

  // 헌혈증 중복 검사
  Bdcard.findAll({
    attributes: ['serial_number'],
  }).then(function (result) {
    result.forEach(element => {
      data = element.dataValues;
      serial_number = data.serial_number;
      if (req.body.bnum == serial_number) {
        duplicated = true;
        res.render('blood_register_form', Object.assign(req.user, { register: "fail" }));
      }

    });
  }).then(function () { // node.js 비동기 처리 위해 위처럼 따로 User.create 안하고 then 씀.
    // duplicated == false일 때(중복 아닐때) db에 저장
    if (duplicated == false) {
      Bdcard.create({
        serial_number: req.body.bnum,
        blood_date: req.body.bdate,
        blood_dona_type: req.body.btype,
        blood_bank_name: req.body.bname
      }).then(function (Bdcard) {
        console.log('success');
        req.user.bdcard_count += 1;
        User.update({
          bdcard_count: req.user.bdcard_count,
        }, {
          where: { user_id: req.body.owner_id },
        }).then(function(User){
          invokeSDK.invoke('register', [req.body.bnum, req.body.owner_id]);
          res.render('blood_register_form', Object.assign(req.user, {register: "success"}));
        }).catch(function(err){
          console.log(err);
        })

      }).catch(function (err) {
        console.log(err);
      });
    }
  }).catch(function (err) {
    console.log(err);
  });
});


// 마이페이지 - 내 기부요청 관리 라우터
router.get('/my_blood_request', function (req, res, next) {
  Reqboard.findAll({
    order: [['id', 'DESC']],
    include: [
      {model: User, required: true},
    ],
    where: {req_user_id: req.user.user_id}
  }).then(function (reqboards) {
    if (req.user) {
      res.render('my_blood_request', Object.assign(req.user, {reqboards: reqboards}));
    }else{
      res.render('my_blood_request');
    }
  }).catch(function (err) {
    console.log(err);
  });
});


// 헌혈증 기부, 기부요청목록, 기부요청 메인화면    main화면에서 기부하러/받으러 가기 >> 버튼 
router.get('/blood_donation_main', function (req, res, next) {
  Reqboard.findAll({
    order: [['id', 'DESC']],
    include: [
      {model: User, required: true},
    ]
  }).then(function (reqboards) {
    var result = {};
    if (req.user) {
      Object.assign(result, req.user);
    }
    Object.assign(result, { register: false });
    Object.assign(result, { reqboards: reqboards });

    res.render('blood_donation_main', result);
  }).catch(function (err) {
    console.log(err);
  });
  
});

// 헌혈증 기부요청   main화면에서 기부요청글 올리기 >> 버튼 
router.get('/blood_request', function (req, res, next) {
  if(req.user){
    res.render('blood_request_form', req.user);
  }else{
    res.render('blood_request_form');
  }
});

// 헌혈증 기부요청 처리
router.post('/blood_request_do', function (req, res, next) {

  Reqboard.create({
    diagnosis: req.body.diagnosis,
    title: req.body.title,
    need_count: req.body.need_count,
    story: req.body.story,
    used_place: req.body.used_place,
    req_user_id: req.body.req_user_id,
  }).then(function () {
    console.log('success');

    Reqboard.findAll({
      order: [['reg_date', 'DESC']],
      include: [
        {model: User, required: true},
      ]
    }).then(function (reqboards) {
      var result = {};
      Object.assign(result, req.user);
      Object.assign(result, { register: "success" });
      if (reqboards) {
        Object.assign(result, { reqboards: reqboards });
      }
      res.render('blood_donation_main', result);
    }).catch(function (err) {
      console.log(err);
    })

  }).catch(function (err) {
    console.log(err);
  });
});

//헌혈증 기부 처리
router.post('/blood_donation', async function (req, res, next) {
  var donate_count = Number(req.body.donate_count);
  var donated_count = Number(req.body.donated_count);
  var need_count = Number(req.body.need_count);
  var req_user_id = req.body.req_user_id;
  var used_place = req.body.used_place;
  var id = req.body.id;
  var req_donated_bdcard_count = Number(req.body.req_donated_bdcard_count);
  var user_bdcard_count = Number(req.body.user_bdcard_count);

  var donater = req.user.user_id;
  
  // bc 기부처리 (헌혈증 소유자, 기부여부, 기부날짜 등 업데이트)
  var serials = await querySDK.query('querySerialsForDonate', [donate_count, donater]);
  serials.forEach((serial) => {
    invokeSDK.invoke('donate', [serial, req_user_id, used_place]);
  });

  await Bdcard.update({
    req_id: id
  },{
    where: {serial_number: serials}
  }).catch(function(err){
    console.log(err);
  })

  // 기부자 헌혈증 개수 감소, 기부 개수 증가 
  req.user.bdcard_count -= donate_count;
  user_bdcard_count -= donate_count;
  req.user.dona_count += donate_count;

  await User.update({
    bdcard_count: user_bdcard_count,
    dona_count: req.user.dona_count
  },{
      where: { user_id: donater }
  }).catch(function (err) {
    console.log(err);
  })

  // 기부 요청자 헌혈증 개수 증가
  await User.update({
    donated_bdcard_count: req_donated_bdcard_count + donate_count
  },{
      where: { user_id: req_user_id }
  }).catch(function (err) {
    console.log(err);
  })
  
  // 기부요청의 기부 개수 상태 업데이트
  var donated_count_update = donate_count + donated_count;
  var need_more = need_count - donated_count_update;

  if(need_count == donated_count_update)
    var is_finished = true;
  else
    var is_finished = false;

  await Reqboard.update({
    donated_count: donated_count_update,
    is_finished: is_finished,
  },{
    where: {id: id},
  }).catch(function(err){
    console.log(Err);
  })

  res.send(Object.assign(req.user, {
    user_bdcard_count: user_bdcard_count.toString(),
    donated_count: donated_count_update.toString(), 
    need_more: need_more.toString(),
    req_donated_bdcard_count: (req_donated_bdcard_count + donate_count).toString(),
    is_finished: is_finished
  }));
  
  
});

// 헌혈증 사용 처리
router.post('/blood_use', async function (req, res, next) {
  
  // id에 해당하는 요청글에 기부된 헌혈증들 가져옴
  var bdcards = await Bdcard.findAll({
    where:{req_id: Number(req.body.id)}
  })
  
  // 가져온 헌헐증 invoke로 사용처리(원장의 상태db 업데이트)
  bdcards.forEach((bdcard) => {
    console.log(bdcard.serial_number);
    invokeSDK.invoke('use', [bdcard.serial_number.toString()]);
  });

  // 요청글 사용 플래그
  await Reqboard.update({
    is_all_used: true
  },{
    where:{id: Number(req.body.id)}
  })

  
  res.send(req.user);
});

// 헌혈증 기부내역 확인    main화면에서 기부내역 확인하러가기 >> 버튼 
router.get('/blood_history', async function (req, res, next) {
  var owner = req.user.user_id;
  var serials = await querySDK.query('donated', owner);

  if (req.user)
    res.render('blood_history', Object.assign(req.user, {data: serials}));
  else
    res.render('blood_history');
});


module.exports = router;
