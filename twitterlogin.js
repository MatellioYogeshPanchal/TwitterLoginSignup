// Create function in service
signInWithTwitter(){
         const twitterObservable = new Observable(observer => {
                setTimeout(() => {

                    // Initialize with your OAuth.io app public key
                    OAuth.initialize('ltAqSLLgbmkeIWisT2aqN-gc0OQ');
                    // Use popup for OAuth
                    OAuth.popup('twitter').then(twitter => {
                        // console.log('twitter:', twitter);
                        // Prompts 'welcome' message with User's email on successful login
                        // #me() is a convenient method to retrieve user data without requiring you
                        // to know which OAuth provider url to call
                        /*twitter.me().then(data => {
                          console.log('data:', data);
                          alert('Twitter says your email is:' + data.email + ".\nView browser 'Console Log' for more details");
                        });*/
                        // Retrieves user data from OAuth provider by using #get() and
                        // OAuth provider url    
                        twitter.get('/1.1/account/verify_credentials.json?include_email=true').then(data => {
                            // console.log('self data:', data);
                            var obj = {data: data};
                            observer.next(obj);
                        })    
                    });

                }, 1000);
         });

         return twitterObservable;
    } 
    
    
    // Using function in componant
    
    // Sign up greb data from twitter
    signInWithTwitter(): void {
        this.socialSubmitted = true;
        this.authenticationService.signInWithTwitter().subscribe(
            res => {               
                if (res && res['data']) {
                    var user = res['data'];
                    // console.log('Twitterrrrrr>>>>', user);
                    this.user                       = user;

                    var fullName = user['name'].split(' ');
                    var fname = fullName[0];
                    var lname = (fullName[2]) ? fullName[2] : (fullName[1]) ? fullName[1] : '';
                    // Assign data to local varibale
                    this.userInfo.user_type         = (this.signupType) ? parseInt(this.signupType) : 1;
                    this.userInfo.is_above_18       = true;
                    this.userInfo.email             = (user['email']) ? user['email'] : '';
                    this.userInfo.name              = (user['name']) ? user['name'] : '';
                    this.userInfo.first_name        = (fname) ? fname : '';
                    this.userInfo.last_name         = (lname) ? lname : '';
                    this.userInfo.image             = (user['profile_image_url_https']) ? user['profile_image_url_https'] : '';
                    this.userInfo.twitter_id        = (user['id_str']) ? user['id_str'] : '';
                    this.userInfo.facebook_id       = '';
                    this.userInfo.instagram_id      = '';
                    this.userInfo.linkedin_id       = '';
                    this.userInfo.google_id         = '';
                    this.userInfo.ip_address        = this.ipAddress;

                    //this.loggedIn = (user != null);
                    // this.currentUser = user;
                    this.registerForm.patchValue({
                        user_type: (this.signupType) ? parseInt(this.signupType) : 1,
                        is_above_18: true,
                        email: (user['email']) ? user['email'] : '',
                        mobile_no: '',
                        first_name: (fname) ? fname : '',
                        last_name: (lname) ? lname : '',
                        password: '',
                        image: (user['profile_image_url_https']) ? user['profile_image_url_https'] : '',
                        twitter_id: (user['id_str']) ? user['id_str'] : '',
                        facebook_id: '',
                        instagram_id:'',
                        linkedin_id: '',
                        google_id: '',
                        ip_address: this.ipAddress
                    });

                    this.registerFormEmail.patchValue({
                        email: (user['email']) ? user['email'] : '',
                        mobile_no: '',
                    });

                    // Send data to register
                    if (this.socialSubmitted) {
                        var that = this;
                        setTimeout(function(){
                            //console.log(that.userInfo);
                            that.commonService.closeOpenModal('SignupModalSocialMedia', 'SignupModalMail');
                        }, 1000);                   
                    }else{
                        this.userInfo = {};
                    }

                }

            
            },
            errorRes => {
               console.log(errorRes);               
            });
    }
    
    
    // Call Function on click
    <button class="btn social-btn-2" (click)="signInWithTwitter()">
              <img src="assets/images/twitter-01.svg">
              Sign-up with Twitter
            </button>
