REACT-NATIVE + FIREBASE:
========================

Firebase è un servizio Cloud che permette di integrare app di vario genere.
Alcune di queste sono tra le più utilizzate nell'ambito mobile, quindi si integrano perfettamente con
il linguaggio REACT-NATIVE.

Prima di procedere però è necessario fare qualche premessa.
Per creare un app firebase da integrare nel mobile bisogna avere un account google.
Questo verrà utilizzato sia per il server Google Cloud che per la Firebase Console.

---
CREAZIONE DI UN PROGETTO FIREBASE & GOOGLE CLOUD:
===========================================

##### _Da Google Cloud_

1. Aprire il sito [https://cloud.google.com/] e cliccare su "console", bottone in alto a destra.
2. Dal menu a tendina (in alto a sinistra) premere per aprire il popup dei progetti e cliccare su "NUOVO PROGETTO".
3. Dare un nome appropriato e cliccare "CREA".

##### _Da Firebase Console_

1. Apri il link [https://console.firebase.google.com] e clicca su "+ aggiungi progetto".
2. Nella schermata del nome scegliere il progetto creato in precedenza su GCloud e clicca "Continua"
3. Clicca ancora "Continua", (scegliere se applicare G-Analytics) poi ancora "Continua".
4. Scegli un account (lo stesso usato nel progetto G-Cloud) poi "Aggiungi Firebase".

---
CREAZIONE DI UN APP REACT NATIVE:
=================================

##### _Da prompt command_


    npx react-native@latest init app-name       

`sostituisci app-name col nome della tua app`

Una volta creata l'app aprila su prompt tramite File Explorer
Ora aprila in VS-Code con
  
    code .

---
SETUP INIZIALE PER FIREBASE:
============================

##### _Da VSCode_

Apri il file **android/app/build.gradle** , poi cerca il nodo
  
    defaultConfig{
        applicationId "com.nome.package"

`cambia "com.nome.package" con il nome id col quale registrare l'app`

#### Crea una certificato .keystore da assegnare al progetto, da prompt :

    keytool -genkey -keystore "/usr/local/rc53/rc.keystore" -alias hawk -keyalg RSA

  - **"/usr/local/rc53/rc.keystore"** è il percorso ed il nome da assegnare al certificato, se il path corrisponde a quello
  del prompt puoi anche scrivere **"rc.keystore"** (`rc` è un nome fittizio, quindi cambialo a tuo piacimento).
  - **hawk** è l'alias del keystore (assegna anche a questo il nome che vuoi).
  - dopo aver premuto invio ti chiede una password (memorizzala o segnala su un foglio) e altri parametri
  come nome, paese, etc... questi sono opzionali.

copia il file **rc.keystore** nella cartella del progetto al percorso `android/app`


---
MEMORIZZA IL KEYSTORE NELLA TUA APP:
====================================

##### _Da VSCode_

Apri il file di progetto `android/gradle.properties` :

    MYAPP_UPLOAD_STORE_FILE=react-demo.keystore
    MYAPP_UPLOAD_KEY_ALIAS=brickpointalias
    MYAPP_UPLOAD_STORE_PASSWORD=LlwMJGfneddcKOrAMB
    MYAPP_UPLOAD_KEY_PASSWORD=LlwMJGfneddcKOrAMB

Apri il file `android/app/build.gradle` :

Aggiungi nel nodo 

    android {
        signingConfigs{

il seguente codice

    release {
        if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
            storeFile file(MYAPP_UPLOAD_STORE_FILE)
            storePassword MYAPP_UPLOAD_STORE_PASSWORD
            keyAlias MYAPP_UPLOAD_KEY_ALIAS
            keyPassword MYAPP_UPLOAD_KEY_PASSWORD
        }
    }


Poi modifica nel nodo
  
    android {
        buildTypes {
            release {
                signingConfig signingConfigs.release      // sostituisci .debug con .release


---
ASSOCIA UN APP DI FIREBASE :
============================

##### _Da VSCode (terminal)_

1. Apri il terminale di VSCode (Terminal > New Terminal) se non lo hai già aperto.
2. Accedi alla cartella android

        cd android

3. Poi scrivi il seguente comando

        ./gradlew signingReport

Questo visualizzerà tutti i certificati associati al progetto.
Dovrai scrivere su un file temporaneo (crea un semplice file txt sul tuo desktop) le seguenti impronte digitali:
  - **SHA1** e **SHA-256** della chiave che hai creato in
    `Store: "C:\Users\myuser\Develop\React-Native\MyApp\android\app\rc.keystore"`
    **(il percorso è un esempio, come il nome rc.keystore del certificato, scegli quelli che corrispondono ai tuoi)**
  - **SHA1** della chiave di debug, il path dovrebbe essere simile a
    **Store: "C:\Users\myuser\Develop\React-Native\MyApp\android\app\debug.keystore"**

##### _Da Firebase Console_

1. Torna sulla console firebase e seleziona al progetto creato in precedenza.
2. In alto clicca sul bototne **"Aggiungi app"** e seleziona l'**icona di Android**.
3. Nel modulo di registrazione App ti chiede alcuni parametri
  - nome android package **"com.nome.package"**, questo è lo stesso che hai scritto prima nel file `android/app/build.gradle`.
  - un nickname (facoltativo)
  - codice SHA (li aggiungerai dopo quindi lascia il campo vuoto).
  Poi clicca su "avanti".
4. Scarica il file **"google-service.json"** 
5. Cocludi cliccando **"Avanti"** e poi **"Vai a console"**.

Adesso dal menu a sinistra premi l'incona a **"ghiera"** e clicca su **"Impostazioni progetto"**.
Vedrai in basso, nella sezione **"Le tue app"** un riquadro col nome dell'app che hai appena creato.
Clicca su **"Aggiungi impronta digitale"**, poi incolla i codici :
  - **SHA1** del tuo certificato .keystore
  - **SHA-256** del tuo certificato .keystore
  - **SHA1** del debug.keystore
  - Memorizzali uno alla volta cliccando su **"Salva"**.

---
INSTALLAZIONE DEI PACCHETTI NPM:
================================
Aggiungi il pacchetto base per l'installazione iniziale di **firebase**

    npm install --save firebase @react-native-firebase/app

poi installa quelli che vuoi implementare (da console Firebase):

**per Firebase auth**

    npm install --save @react-native-firebase/auth

**Per Facebook Auth**
    
    npm install --save react-native-fbsdk-next
    
**Per firebase Storage**

    npm install --save @firebase/storage

**Per firebase Realtime Database**

    npm install --save @firebase/database

---
SETUP DI ANDROID PER FIREBASE:
==============================

Da VSCode:
----------

Apri il file `android/app/build.gradle`, poi aggiungi le seguenti righe come segue:

    apply plugin: "com.google.gms.google-services"        // in alto

sotto il nodo

    dependencies {
  
aggiungi quanto segue per configurare firebase 

    implementation(platform("com.google.firebase:firebase-bom:32.7.0"))

poi a seconda del servizio che vuoi implementare agigungi

    // for Firebase Auth
    implementation("com.google.firebase:firebase-auth:22.3.0")
    // for Google Auth
    implementation("com.google.android.gms:play-services-auth:20.7.0")
    // for Facebook Auth
    implementation("com.facebook.android:facebook-android-sdk:latest.release")
    // for Firebase Analytics
    implementation("com.google.firebase:firebase-analytics:17.3.0")
    // for Realtime Database
    implementation("com.google.firebase:firebase-database:20.3.0")

---
AUTH FIREBASE (AUTENTICAZIONE):
===============================

##### _Da Firebase Console_

#### **Fase iniziale**
1. Apri il progetto creato in precedenza.
2. Da menu a sinistra scegli Authentication (sotto la voce Creazione).
3. Clicca sul bototne "Inizia".
4. Dalla top bar in alto scegli "Sign-in method".

##### **Accedi con Email e Password**
1. Dal provider di accesso scegli "Email/password".
2. Quando si apre il riquadro seleziona "Abilita" e poi clicca su "Salva".

##### **Accedi con Google**
1. Ripeti i passaggi della **fase iniziale**
2. Dal provider di accesso scegli "Google".
3. Quando si apre il riquadro seleziona "Abilita"
4. Dal Menu a tendina scegli una "Email dell'assistenza per il progetto" e poi clicca su "Salva".

##### **Accedi con Facebook**  (Per questa fase occorre accedere alla console di Meta)
##### _Da Meta Console_
1. Apri il sito "https://developers.facebook.com/".
2. Clicca in alto a destra "Le mie App".
3. Clicca il bottone verde in alto a destra "Crea un'app".
4. Scegli tra le opzioni "Cosa vuoi che faccia la tua app?" quella che più si addice al tuo progetto.
5. Scegli l'opzione "sto creando un gioco" o "non sto creando un gioco".
6. Dai un nome alla tua app e clicca il bototne verde "Crea App".
7. Un tuo profilo per accedere, aggiungi la password e clicca "Invia".
8. Adesso hai un menu a sinistra con diverse opzioni
9. Apri "Impostazioni App" > "Di base".
10. Memorizza su un file txt **"ID app"** e **"Chiave segreta"** (serve cliccare su "Mostra" per copiarla).
##### _Da Firebase Console_
11. Torna su **Firebase Console** e ripeti i passaggi della **fase iniziale** per aprire il riquadro di autenticazione.
12. Dal provider di accesso scegli "Facebook".
13. Quando si apre il riquadro seleziona "Abilita"
14. Scrivi gli **"ID app"** e **"Chiave segreta"** nei campi di testo (quelli che hai memorizzato al punto 10).
15. Copia il link "Callback url" sotto e "Salva".
##### _Da Meta Console_
16. Torna su Meta console Clicca su "Casi d'uso".
17. In "Autenticazione e creazione dell'account" clicca sul pulsante "Personalizza".
18. In basso Clicca su "Aggiungi" nel tab "Email" (o lascia così se leggi già "Pronta per il test").
19. Sotto "Facebook Login" > "Impostazioni" clicca su "Vai a Impostazioni".
20. Incolla in "URI di reindirizzamento OAuth validi" il link copiato al punto 15.
21. Salva le modifiche.

#### **Fase finale**
##### _Da Firebase Console_
1. Fatto ciò apri il menu a sinistra icona "ghiera" e poi "Impostazioni progetto".
2. Scarica il file "google-service.json".
##### _In VSCode_
3. Copia il file scaricato nella cartella di progetto `android/app`.
  **Se dovesse dare qulche tipo di errore prova a salvare il file anche in `android/app/src`**

**Questa parte non aggiunge la funzionalità di autenticazione alla tua app React-Native ma serve per poterla implementare
via codice.**
