const fs = require("fs");
const express = require("express");
const app = express();
const PORT = 8000;
// const wbm = require("./src/index");
const csv = require("csv-parser");
const bodyParser = require("body-parser");
const CsvUpload = require("express-fileupload");
const cors = require("cors");
const { Readable } = require('stream');
const { Client } = require('whatsapp-web.js');


const numbers = [];
let message = ""
app.use(express.json());
app.use(cors());
app.use(CsvUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.post('/uploadMessage', (req, res)=>{
  console.log(req.body)
  message = req.body.message
  console.log(message,'this is the new m sg')
  return res.status(200).json({ message: "numbers stored sucessfully", message: message})
  
})

app.post("/uploadData", (req, res) => {
  const csvData = req.files.csvFile.data.toString('utf-8');
  console.log(csvData, 'flie dnfaisdjf')
 
  const stream =  Readable.from(csvData);
  
  
  stream
  .pipe(csv())
  .on('data', (data) => {
    console.log(data, 'data in on')
    // Assuming the column header containing mobile numbers is 'mobileNumber'
    const mobileNumber = data;

    // If you need to perform any validation on the mobile number, do it here
    // For example, you can check if the mobileNumber is valid before adding it to the array.

    numbers.push(mobileNumber.phone);
  })
  .on('end', () => {
    // At this point, all mobile numbers are stored in mobileNumbersArray
    console.log('Mobile numbers have been extracted and stored in the array:', numbers);
    return res.status(200).json({ message: "numbers stored sucessfully", data: numbers });
    // You can perform further actions with the mobile numbers here.
  });

})


  
// client.initialize();

// Event listener for receiving QR code and emitting to the frontend
// client.on('qr', (qr) => {
//   qrCode.toDataURL(qr, (err, qrDataURL) => {
//     if (err) {
//       console.error('Error generating QR code:', err);
//     } else {
//       io.emit('qr_code', qrDataURL);
//     }
//   });
// });


// client.on('ready', async()=>{

//   const number = "9730626917";
//   const messageBody = 'Hello, this is a WhatsApp message sent via whatsapp-web.js!';
//   const sanitized_number = number.toString().replace(/[- )(]/g, ""); // remove unnecessary chars from the number
//   const final_number = `91${sanitized_number.substring(sanitized_number.length - 10)}`; // add 91 before the number here 91 is country code of India
//   for(let i =0; i<5; i++){
//       const number_details = await client.getNumberId(final_number); // get mobile number details
      
//       if (number_details) {
//           const sendMessageData = await client.sendMessage(number_details._serialized, messageBody); // send message
//       } else {
//           console.log(final_number, "Mobile number is not registered");
//       }
//   }
// })





// // Endpoint to generate and emit the QR code to the frontend
// app.get('/generateQRCode', (req, res) => {
//   // Generate a new QR code and emit it to the frontend
//   client.generateNewQRCode();
//   return res.json({ message: 'QR code generation initiated' });
// });
// app.get('/generateQRCode', (req, res) => {
//   client.getQrCode().then((qrCodeData) => {
//     qrCode.toDataURL(qrCodeData, (err, qrDataURL) => {
//       if (err) {
//         console.error('Error generating QR code:', err);
//         return res.status(500).json({ error: 'Error generating QR code' });
//       }
      
//       io.emit('qr_code', qrDataURL); // Emit the QR code data to the frontend using Socket.io
//       return res.json({ QR: qrDataURL });
//     });
//   });
// });

const qrcode = require("qrcode-terminal");

app.get('/getQrCode', async (req, res) => {
  const qrcode = require("qrcode-terminal");

  const { Client, LocalAuth } = require("whatsapp-web.js");

  const client = new Client({
    authStrategy: new LocalAuth(),
  });
  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });

    res.json({QRcode: qr})
  });

  client.on('ready', async()=>{

    for(let i = 0; i < numbers.length; i++ ){
        let number = numbers[i];
        const sanitized_number = number.toString().replace(/[- )(]/g, ""); // remove unnecessary chars from the number
        const final_number = `91${sanitized_number.substring(sanitized_number.length - 10)}`; // add 91 before the number here 91 is country code of India
        // for(let i =0; i<5; i++){
        const number_details = await client.getNumberId(final_number); // get mobile number details
            
          if (number_details) {
              const sendMessageData = await client.sendMessage(number_details._serialized, message); // send message
          } else {
            console.log(final_number, "Mobile number is not registered");
          }
      }
      // }
    


});

  client.initialize();

  res.status(200).json("ok");
});







//fsdfasdsdsdsdsdsdsdsdsd

app.get('/generateQRCode', async(req, res)=>{
  try {
    const client = new Client()
    client.initialize();
    let qr = await new Promise((resolve, reject) => {
        client.once('qr', (qr) => resolve(qr))

        setTimeout(() => {
            reject(new Error("QR event wasn't emitted in 50 seconds."))
        }, 50000)
    })
    qrcode.generate(qr, { small: true });
    res.json({qrCode:qr})
    client.on('ready', async()=>{
      for(let i = 0; i < numbers.length; i++ ){
        let number = numbers[i];
      const sanitized_number = number.toString().replace(/[- )(]/g, ""); // remove unnecessary chars from the number

      const final_number = `91${sanitized_number.substring(sanitized_number.length - 10)}`; // add 91 before the number here 91 is country code of India
      // for(let i =0; i<5; i++){
          const number_details = await client.getNumberId(final_number); // get mobile number details
          
          if (number_details) {
              const sendMessageData = await client.sendMessage(number_details._serialized, message); // send message
          } else {
              console.log(final_number, "Mobile number is not registered");
          }
      // }
    }
     return res.status(200).json({message: "messeage sent completed!"})
    
    });
} catch (err) {
    res.send(err.message, 'fjdslkajfas')
}
//   client.initialize();

// // Event listener for receiving QR code and emitting to the frontend
// client.on('qr', (qr) => {
//   qrCode.toDataURL(qr, (err, qrDataURL) => {
//     if (err) {
//       console.error('Error generating QR code:', err);
//     } else {
//       io.emit('qr_code', qrDataURL);
//     }
//   });
// });
//   client.initialize()
  
//   client.on('qr', (qr)=>{
//   console.log('REACHED HERE')
//   console.log(qr)
//  // Emit the QR code data to the frontend using Socket.io
// //  io.emit('qr_code', qrDataURL);
//  return res.json({ QR: qr, MESSAGE: "QR CODE IS SENDING..." });
// })



  // return res.status(200).json({ message: "numbers stored sucessfully", message: message})
  
})











    // console.log(req.files.csvFile, 'csv file dataa')
//     fs.createReadStream(req.files.csvFile)
//     .pipe(csv())
//     .on('data', data => (number)=> console.log(number, 'this is nuumberr'))
//     .on('end', ()=> console.log(numbers))

//   }
//   return res.status(200).json({ message: "data got sucessfully", data: numbers });
// });





// fs.createReadStream('newContacts.csv')
//   .pipe(csv())
//   .on('data', (number) => numbers.push(number.phone))
//   .on('end', () => {
//     // Send message
//     wbm
//       .start()
//       .then(async () => {
//         const message = 'Project completed!!!';
//         await wbm.send(numbers, message, 200);
//         await wbm.end();
//       })
//       .catch((err) => console.log(err));
//   });

app.listen(PORT, () => console.log("server is runnig on PORT: ", PORT));
