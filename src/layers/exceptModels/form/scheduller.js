//하루 한 번 실행해야 하는 기능들 모음.
/**
 * 1. 좋아요 정산 : 유저들이 하루 동안 모은 무드포인트
 * (UserDetail의 pointArray)를  무드포인트(UserDetail의 moodPoint)에
 * 더해주기 => 정산 시간을 더 짧게 시도해볼지 생각해볼 것.
 * pointArray 다시 0으로 맞춰줘야함.
 *
 * 2. 사용자 등급 정산 : 사용자의 등급이 상승할 조건을 충족 시켰다면
 * 상승 시키고 알림을 넣어주기. 유저의 등급 아이콘도 바꿔줘야함.
 *
 * 3. hot posts : 전날 가장 좋아요를 많이 받은 게시물을 출력하기
 * => 만약 게시물이 삭제 되었을때는??
 * ==> form/moodPint.js 의 whenInRankingMyPost 실행 시켜주셔야 해요!
 *
 * 4. 알림이 2일 이상 지났다면 삭제하기
 *
 *
 */

//스케줄러
// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)
const schedule = require('node-schedule');
const { User, UserDetail, Post } = require('../../../sequelize/models');

//한국시간으로 새벽 00시 10분 00초 마다 실행 (우분투에서는 9시간의 시차가 있어보여요.)
schedule.scheduleJob('0 10 15 * * *', () => {
    scheduleHandller();
});

const totalLikeCount = async () => {
    const pointArrays = await UserDetail.findAll({
        attributes: ['detailId', 'moodPoint', 'pointArray'],
        raw: true
    });

    for (let pointArray of pointArrays) {
        const point = JSON.parse(pointArray.pointArray);

        UserDetail.update(
            {
                moodPoint:
                    pointArray.moodPoint +
                    point.reduce(function add(sum, currValue) {
                        return sum + currValue;
                    })
            },
            {
                where: { detailId: pointArray.detailId }
            }
        );
    }
};

totalLikeCount();
const scheduleHandller = async () => {};

module.exports = {
    schedule
};
