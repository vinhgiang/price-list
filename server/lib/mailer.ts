// import { createTransport } from 'nodemailer';

// const transporter = createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'mean18082017',
//         pass: '18082017mean'
//     }
// });

// export function sendVerifyEmail(activeCode, userId, email) {
//     return new Promise((resolve, reject) => {
//         transporter.sendMail({
//             from: '"khoaphamsignal" <admin@khoapham.vn',
//             to: email,
//             subject: 'Khoa Pham Signal Verification email',
//             html: `
//             <div>
//                 Click to <a href="">HERE</a> verify your account.
//                 <img src="cid:unique@kreata.ee"/>
//             </div>`,
//             attachments: [{
//                 filename: 'b.png',
//                 path: 'https://assets.servedby-buysellads.com/p/manage/asset/id/28536',
//                 cid: 'unique@kreata.ee' //same cid value as in the html img src
//             }]
//         }, (err, info) => {
//             if (err) return reject(err);
//             resolve(info);
//         });
//     })
// };

// // https://myaccount.google.com/lesssecureapps
// // https://accounts.google.com/DisplayUnlockCaptcha

// sendVerifyEmail('ancasdc', '82e8', 'vanpho01@gmail.com')
// .then(console.log)
// .catch(console.log);

// console.log(__dirname)
