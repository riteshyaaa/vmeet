import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../context/AuthContext';
import Snackbar from '@mui/material/Snackbar';

const defaultTheme = createTheme();

export function Authentication() {
   const [ username, setUsername]= React.useState();
   const [ password, setPassword]= React.useState();
   const [ name, setName]= React.useState();
   const [ error, setError]= React.useState();
   const [ message, setMessage]= React.useState();
   const [ formState, setFormState]= React.useState(0);
   const [ open, setOpen]= React.useState();



   const { handleRegister, handleLogin } = React.useContext(AuthContext);
   

     let handleAuth = async () => {
        try {
            if (formState === 0) {

                let result = await handleLogin(username, password)
            
                console.log(result)

            }
            if (formState === 1) {
                const  result = await handleRegister(name, username, password);
               
               console.log(result)
                setMessage(result);
                setOpen(true);
                
              
                
            }
        } catch (err) {
            let message = (err.response.data.message);
            setError(message);
        }
    }


  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <div>
          <Button variant={formState ==0 ? "contained":""} onClick={()=> {setFormState(0)}}>
            Sign in
          </Button>
          <Button variant={formState ==1 ? "contained":""} onClick={()=> {setFormState(1)}}>
            Sign up
          </Button>
          </div>
          
          <Box component="form"  noValidate sx={{ mt: 1 }}>
           
            {formState == 1 ? <TextField
            
              margin="normal"
              required
              fullWidth
              id="username"
              label="Full Name"
              name="name"
              autoFocus
              onChange={ e =>{setName(e.target.value)}}
            />: <></> }
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus
              onChange={ e =>{setUsername(e.target.value)}}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={ e =>{setPassword(e.target.value)}}
              
            />
           <p style={{color: "red"}}>{error}</p>
           <Button
              type="Button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleAuth}
            >
             {formState == 0? "Sign In": "Sign Up"} 
            </Button>
           
            
            {formState==0 ?  <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              
            </Grid>:<></> }
          </Box>
        </Box>
      </Container>
       <Snackbar

                open={open}
                autoHideDuration={4000}
                message={message}
                color='white'
            />

    </ThemeProvider>
  );
}
