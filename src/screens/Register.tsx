import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, StatusBar, TextInput, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function Register ({navigation}:any) {
    const { h3, body, input, fieldBox, fieldBoxLabel, ScrollViewFlex, dividerText, linkLoginContainer, textLinkLogin, ScreenContainer,iconLogo } = styles;

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        console.log('isLogin → ', isLogin);
        if (isLogin) {
            const unsubscribe = auth().onAuthStateChanged( user => {
                if (user) {
                console.log('User → ', user);
                navigation.navigate('Feed', {userInfo: user});
                } else {
                console.log('No user affected');
                navigation.navigate('Login');
                }
            });
            return () => unsubscribe();
        } else {
            navigation.navigate('Register');
        }
    });

    const firebaseConfig = {
        databaseURL: 'https://twittermobileclone-default-rtdb.europe-west1.firebasedatabase.app',
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    const database = getDatabase(app);

    var temp_uid = '';

    GoogleSignin.configure({
        webClientId: '630818011382-nltmsl8o5ohcg6q1esbqa1m73ucktmpr.apps.googleusercontent.com',
    });

    // To create new account
    const registerWithUserData = async () => {
        try {
            // Register auth data (email & password to Firebase Auth service)
            const response = await auth().createUserWithEmailAndPassword(email, password).then(() => {
                console.log('User account created & signed in!');
            });

            // Read from authState the newly created Uid
            auth().onAuthStateChanged( user => {
                if (user) {
                    temp_uid = user.uid;
                    console.log('user ID registered as : ',temp_uid, ', from : ' , user.uid);
                    set(ref(database, 'users/' + temp_uid), {
                        userId: temp_uid,
                        name: name,
                        surname: surname,
                        email: email,
                    });
                }
            });

            // write user info to Realtime DB (uid, name, surname, email)
            console.log(`response = ${response}`);
            navigation.navigate('Feed');
        } catch (error) {
            if (error != null )
            {
            console.log('Some error on registration process : ', error);
            }
            console.log(`error = ${error}`);
        } finally {
            // creation process ended
        }
    };

    const onGoogleButtonPress = async () => {
        try {
            // Check if your device supports Google Play
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            // Get the users ID token
            const { idToken } = await GoogleSignin.signIn();
            console.log('token id → ',idToken);
            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            // Sign-in the user with the credential
            return auth().signInWithCredential(googleCredential);
        } catch ({error}:any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                console.log('error type → canceled : ', statusCodes.SIGN_IN_CANCELLED);
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
                console.log('error type → in progress : ', statusCodes.IN_PROGRESS);
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                console.log('error type → not available : ', statusCodes.PLAY_SERVICES_NOT_AVAILABLE);
            } else {
                // some other error happened
                console.log('error type → : ', error, ', & statuscode → ',statusCodes);
            }
        }
    };

    const onFacebookButtonPress = async () => {
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
        if (result.isCancelled) {
            throw 'User cancelled the login process';
        }
        const data = await AccessToken.getCurrentAccessToken();

        if (!data) {
            throw 'Something went wrong obtaining access token';
        }

        // Create a Firebase credential with the AccessToken
        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

        // Sign-in the user with the credential
        return auth().signInWithCredential(facebookCredential);
    };

    return (
        <View style={ScreenContainer}>
            <StatusBar backgroundColor="#ddd"/>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={ScrollViewFlex}>
                <View style={body}>
                    <FontAwesome5 name={'lock-alt'} style={iconLogo}/>;
                    <Text style={h3}>Register</Text>

                    <View style={fieldBox}>
                        <Text style={fieldBoxLabel}>Name</Text>
                        <TextInput
                            value={name}
                            placeholder="Name*"
                            autoCapitalize="none"
                            style={input}
                            onChangeText={(textfield) => setName(textfield)}
                            />
                    </View>

                    <View style={fieldBox}>
                        <Text style={fieldBoxLabel}>Surname</Text>
                        <TextInput
                            value={surname}
                            placeholder="Surname*"
                            autoCapitalize="none"
                            style={input}
                            onChangeText={(textfield) => setSurname(textfield)}
                            />
                    </View>

                    <View style={fieldBox}>
                        <Text style={fieldBoxLabel}>E-mail</Text>
                        <TextInput
                            value={email}
                            placeholder="Email Address*"
                            autoCapitalize="none"
                            style={input}
                            onChangeText={(textfield) => setEmail(textfield)}
                            />
                    </View>

                    <View style={fieldBox}>
                        <Text style={fieldBoxLabel}>Password</Text>
                        <TextInput
                            secureTextEntry
                            value={password}
                            placeholder="Password*"
                            autoCapitalize="none"
                            style={input}
                            onChangeText={(textfield) => setPassword(textfield)}
                            />
                    </View>

                    <View style={fieldBox}>
                        <Text style={fieldBoxLabel}>Confirm Password</Text>
                        <TextInput
                            secureTextEntry
                            value={passwordCheck}
                            placeholder="Confirm Password*"
                            autoCapitalize="none"
                            style={input}
                            onChangeText={(textfield) => setPasswordCheck(textfield)}
                            />
                    </View>

                    {/* Email registration */}
                    <Button title="Register" onPress={registerWithUserData} />

                    {/* Texts Links */}
                    <View style={linkLoginContainer}>
                        <TouchableOpacity onPress={() => {
                        navigation.navigate('Login');
                        }}>
                            <Text style={textLinkLogin}>I already have an account</Text>
                        </TouchableOpacity>
                    </View>

                    <View><Text style={dividerText}>- or -</Text></View>

                    {/* Facebook Login */}
                    <Button color={'#0866FF'}
                        onPress={() => onFacebookButtonPress()
                            .then(()=>{
                                setIsLogin(true);
                                console.log('User signed in using Facebook');
                            })
                            .catch(error => {
                                console.log(error);
                            })
                        }
                        title="Access with Facebook" />

                    {/* Google Login */}
                    <Button color={'#DF4B38'}
                        onPress={() => onGoogleButtonPress()
                            .then(()=>{
                                setIsLogin(true);
                                console.log('User signed in using Google');
                            })
                            .catch(error => {
                                console.log(error);
                            })
                        }
                        title="Access with Google" />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    ScreenContainer: {
        flex: 1,
        backgroundColor: '#ddd',
    },
    body: {
        flex:1,
        backgroundColor: '#d6d6d6',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        padding: 20,
    },
    h3: {
        justifyContent: 'center',
        alignItems: 'center',
        color: '#333',
    },
    fieldBox:{
        width: '100%',
    },
    fieldBoxLabel: {
        color: '#333',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#f5f5f5',
        textAlign: 'auto',
        color: '#333',
    },
    text: {
        color: '#ddd',
        fontWeight: 'bold',
    },
    textContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    textLogin: {
        color: '#ddd',
        fontWeight: 'bold',
    },
    textLinkLogin: {
        color: '#333',
        fontWeight: 'bold',
    },
    iconText: {
        color: '#ddd',
    },
    button: {
        width: '100%',
        justifyContent: 'flex-start',
        elevation: 3,
    },
    buttonLogin: {
        width: '100%',
        elevation: 3,
        backgroundColor:'#616161',
    },
    xstackCheck: {
        alignSelf: 'flex-start',
    },
    socialIcon: {
        width: 30,
        height: 30,
    },
    socialIconContainer: {
        justifyContent: 'flex-start',
    },
    ScrollViewFlex: {
        flexGrow: 1,
    },
    ScrollViewInnerView: {
        flex: 1,
        justifyContent: 'space-between',
    },
    dividerText: {
        color: '#333',
    },
    linkLoginContainer: {
        width: '100%',
        flexDirection:'row',
        justifyContent: 'center',
    },
    iconLogo: {
        color: '#333',
    },
});
