import axios from 'axios';
import { Avatar, CardContent, Typography, IconButton  } from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { grey } from '@mui/material/colors';
import GitHubIcon from '@mui/icons-material/GitHub';
import LogoDev from '@mui/icons-material/LogoDev';
import { useEffect, useState, useRef } from 'react';
import './App.css';

function redirectToYoutube() {
  window.location.href = 'https://www.youtube.com/channel/your-channel-id';
}

function redirectToGithub() {
  window.location.href = 'https://www.github.com/theofficialpeter';
}

const redirectToDevSite = () => {
  window.location.href = 'https://dev.to/theofficialpeter';
};

// Component that shows my local time
function Footer({ timezone }) {
  const [localTime, setLocalTime] = useState(new Date().toLocaleTimeString('en-US', { timeZone: timezone }));

  useEffect(() => {
    const interval = setInterval(() => {
      setLocalTime(new Date().toLocaleTimeString('en-US', { timeZone: timezone }));
    }, 1000);

    return () => clearInterval(interval);
  }, [timezone]);

  return (
    <div className="footer">
      <span>🕒 {localTime}</span>
    </div>
  );
}

function App() {
  const canvasRef = useRef(null);
  const [bio, setBio] = useState('');

  // fetch github description
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await axios.get('https://api.github.com/users/theofficialpeter');
      setBio(response.data.bio);
    };

    fetchProfile();
  }, []);

  // background space animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let numStars = 2000;
    let radius = '0.' + Math.floor(Math.random() * 9) + 1;
    let focalLength = canvas.width * 2;
    let warp = 0;
    let centerX, centerY;

    let stars = [], star;
    let i;

    function initializeStars() {
      centerX = canvas.width / 2;
      centerY = canvas.height / 2;

      stars = [];
      for (i = 0; i < numStars; i++) {
        star = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * canvas.width,
          o: '0.' + Math.floor(Math.random() * 99) + 1
        };
        stars.push(star);
      }
    }

    function moveStars() {
      for (i = 0; i < numStars; i++) {
        star = stars[i];
        star.z--;

        if (star.z <= 0) {
          star.z = canvas.width;
        }
      }
    }

    function drawStars() {
      let pixelX, pixelY, pixelRadius;

      // Resize to the screen
      if (canvas.width !== window.innerWidth || canvas.width !== window.innerWidth) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initializeStars();
      }
      if (warp === 0) {
        ctx.fillStyle = "rgba(0,10,20,1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.fillStyle = "rgba(41, 36, 9, " + radius + ")";
      for (i = 0; i < numStars; i++) {
        star = stars[i];

        pixelX = (star.x - centerX) * (focalLength / star.z);
        pixelX += centerX;
        pixelY = (star.y - centerY) * (focalLength / star.z);
        pixelY += centerY;
        pixelRadius = 1 * (focalLength / star.z);

        ctx.beginPath();
        ctx.arc(pixelX, pixelY, pixelRadius, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(237, 207, 55, " + star.o + ")";
        ctx.fill();
      }
    }

    function executeFrame() {
      moveStars();
      drawStars();
      requestAnimationFrame(executeFrame);
    }

    initializeStars();
    executeFrame();
  }, []);

  return (
    <div className='background'>
      <canvas ref={canvasRef} className="canvas"></canvas>
      <div className="card">
        <CardContent className="content">
          <Avatar src="https://github.com/TheOfficialPeter.png" alt="Profile Picture" className="avatar" style={{ height: '80px', width: '80px' }}  />
          <Typography variant="h5" component="div" className="username">
            TheOfficialPeter
          </Typography>
          <Typography variant="subtitle2" className='description'>{bio}</Typography>

          <div onClick={redirectToGithub} className="github-button">
            <IconButton sx={{ color: grey[100] }} target="_blank" rel="noopener noreferrer">
              <GitHubIcon />
            </IconButton>
            <p style={{ fontWeight: "500" }}>Github</p>
          </div>

          <div onClick={redirectToDevSite} className="dev-button">
            <IconButton sx={{ color: grey[900] }} target="_blank" rel="noopener noreferrer">
              <LogoDev />
            </IconButton>
            <p style={{ fontWeight: "500", color: "black" }}>Dev</p>
          </div>
        
        <Footer timezone="Africa/Johannesburg" />
        </CardContent>
      </div>
    </div>
  );
}

export default App;
