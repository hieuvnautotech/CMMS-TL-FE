import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { login, api_get,api_post } from '@utils';
import { MapFormToModelData, HasValue } from "@plugins/helperJS";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';




const theme = createTheme();

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {

            errorMessages: [],
            isLoading: false,
            
        }
        this.username = React.createRef();
        this.password = React.createRef();
    }

test=()=>{
    api_get("TestApi",{p1:'dfdfd'}).then(res=>{

        console.log('aaa')
        console.log(res)
    }).catch(error=>{
        console.log(error)
    })
   
    // var model={Id:122,Name:"fd"}

    // api_post("testapi/postdata1",model).then(res=>{

    //     console.log('aaa')
    //     console.log(res)
    // }).catch(error=>{
    //     console.log(error)
    // })

}
    onLogin = (e) => {
        e.preventDefault();
        this.setState(previousState => ({
            ...previousState,
            errorMessages: []
        }));

        const model = MapFormToModelData(e.target);
        if (model) {
            const errorMessages = [];
        
            if (model.username === '' || !HasValue(model.username)) {
                errorMessages.push("Bạn chưa nhập tên đăng nhập");
                 this.username.current.focus();
                  
            }
            if (model.password === '' || !HasValue(model.password)) {
                errorMessages.push("Bạn chưa nhập mật khẩu");
               
            }

            if (errorMessages.length > 0) {
                this.setState(previousState => ({
                    ...previousState,
                    errorMessages
                }));
            } else {
                this.setState(previousState => ({
                    ...previousState,
                    isLoading: true
                }));
              
                login(model.username, model.password, model.rememberMe).then(data => {

                    this.setState(previousState => ({
                        ...previousState,
                        isLoading: false
                    }));

             
                         console.log(data)
                       this.props.history.push("/")

                    
                   
                }).catch(errors => {
                    const errorMessages = [];
                  
                    if (typeof errors === 'string') {
                        errorMessages.push(errors.trim());
                    } else if (typeof errors === 'object') {
                    
                        for (let key in errors) {
                            errorMessages.push(errors[key]);
                        }
                    } 
                    this.setState(previousState => ({
                        ...previousState,
                        errorMessages,
                        isLoading: false
                    }));
                });
                
              
            }
        }
    }

    render() { 
        const { errorMessages, isLoading } = this.state;
        return ( 
            <ThemeProvider theme={theme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
              <CssBaseline />
              <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                  backgroundImage: 'url(https://source.unsplash.com/random)',
                  backgroundRepeat: 'no-repeat',
                  backgroundColor: (t) =>
                    t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Box
                  sx={{
                    my: 8,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    Sign in
                  </Typography>
                  <Box component="form" noValidate onSubmit={this.onLogin}   sx={{ mt: 1 }}>
                    <TextField
                         ref={this.username}
                      margin="normal"
                      required
                      fullWidth
                      id="username"
                      label="Username"
                      name="username"
                      autoComplete="username"
                      autoFocus
                    />
                    <TextField
                         ref={this.password}
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                    />
                    {/* <FormControlLabel
                      control={<Checkbox value="remember" color="primary" />}
                      label="Remember me"
                    /> */}
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Sign In
                    </Button>

                    {errorMessages.length ? <>
                                                {
                                                    errorMessages.map((errorMessage) => {
                                                        return <p  style={{color:'red'}}>{errorMessage}</p>;
                                                    })
                                                }
                                            
                                            
                                            </>:''}
                                           
                    {/* <Grid container>
                      <Grid item xs>
                        <Link href="#" variant="body2">
                          Forgot password?
                        </Link>
                      </Grid>
                      <Grid item>
                        <Link href="#" variant="body2">
                          {"Don't have an account? Sign Up"}
                        </Link>
                      </Grid>
                    </Grid> */}
                    {/* <Copyright sx={{ mt: 5 }} /> */}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </ThemeProvider>
         );
    }
}
 
export default reduxForm({
    form: 'Login'
})(Login);