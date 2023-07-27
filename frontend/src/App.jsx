import { useState } from "react";
import axios from "axios";

import QRCode from 'react-qr-code';
import "./App.css";

function App() {

  const [csvFile, setCsvFile] = useState(null);
  const [message, setMessage] = useState('');
  const [QrcodeData, setQrcodeData] = useState('');
  // useEffect(() => {
  //   if(QrcodeData){
  //     console.log(QrcodeData, 'THIS IS QR DATA')
  //       const qrCodeContainer = document.getElementById('qrCodeContainer');
  //       qrCodeContainer.innerHTML = '';
        // QRCode.toCanvas(qrCodeContainer, QrcodeData, (error) => {
        //   if (error) {
        //     console.error('Error generating QR code:', error);
        //   }
        // });
  //   }
    
  // }, [QrcodeData]);

  const fileUploadHandleler = (e) => {
   console.log( e.target.files)
    setCsvFile(e.target.files[0])
  }
  const handleCSVSubmit = async(e)=>{
    e.preventDefault()
  
    const url = 'http://localhost:8000/uploadData';
    
    const formData = new FormData();
    formData.append('csvFile', csvFile);
    const res = await axios.post(url, formData)
    console.log(res)

  }
  const handleMessageSubmit = async(e)=>{
    e.preventDefault()
    const url = 'http://localhost:8000/uploadMessage';

    await axios.post(url, { message: message })
    setMessage('')
  }
  const getQRcode = async(e)=>{
    e.preventDefault()
    const url = 'http://localhost:8000/generateQRCode';

    const res = await axios.get(url)
    console.log(res)
    setQrcodeData(res.data.qrCode)
  }

  return (
    <div className="mt-12 flex flex-col items-center">
      <div  className="mt-12 flex flex-col items-center">
      <h1>UPLOAD CSV CONTACT NUMBER FILE</h1>
      <form onSubmit={handleCSVSubmit}>
        {/* <input type={"file"} accept={".csv"} /> */}
        <input type="file" name="csvFile" onChange={fileUploadHandleler} />
        <button type="submit" className="border px-3 py-1 rounded bg-green-500 hover:bg-green-700 text-white font-bold">UPLOAD FILE</button>
      </form>
      </div>
      <div className="mt-12 flex flex-col items-center justify-center"> 
      <h1>Custom message to be sent</h1>
      <form onSubmit={handleMessageSubmit}>
        <textarea className="border w-96" value={message} onChange={(e)=> setMessage(e.target.value)} />
        <button type="submit" className="border px-3 py-1 rounded bg-green-500 hover:bg-green-700 text-white font-bold">UPLOAD MESSAGE</button>
      </form>
      </div>
      <div>
        <button onClick={getQRcode} className="border mt-12 px-3 py-1 rounded bg-green-500 hover:bg-green-700 text-white font-bold">GENERATE QR CODE</button>
        {
          QrcodeData &&  
          <QRCode
                        title="Whatsapp web"
                        value={QrcodeData}
                        bgColor="#FFFFFF"
                        fgColor="#000000"
      />
        }
        {/* <div id="qrCodeContainer"></div> */}
      </div>
      
    </div>
  );
}

export default App;
