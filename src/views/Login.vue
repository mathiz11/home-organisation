<script>
import Input from "../components/Input.vue"
import { signInWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth"
import store from "../store"
import { firebaseApp } from "../firebase"

const auth = getAuth(firebaseApp)

export default {
    components: {
        Input
    },
    data() {
        return {
            email: "",
            password: "",
            error: null
        }
    },
    methods: {
        login() {
            signInWithEmailAndPassword(auth, this.email, this.password)
                .then(result => {
                    store.user = result.user
                    this.$router.push("/")
                })
                .catch(reason => {
                    if (reason.code === "auth/user-not-found" || reason.code === "auth/wrong-password") {
                        this.error = "Les identifiants saisis sont incorrects."
                    }
                })
        }
    }
}
</script>

<template>
    <div class="w-72 mx-auto flex flex-col justify-center">
        <h1 class="text-3xl pb-5 text-center">Connexion</h1>
        <div v-if="error" class="bg-red-300 text-red-900 border border-red-900 px-5 py-2 rounded mb-2">{{ error }}</div>
        <form @submit.prevent="login">
            <Input id="email" label="Email" type="text" v-model="email" />
            <Input id="password" label="Mot de passe" type="password" v-model="password" />
            <div class="flex justify-center">
                <button class="bg-green-400 px-5 py-2 rounded-md mt-1 text-white"
                    :disabled="!email.trim() || !password.trim()">
                    Se connecter
                </button>
            </div>
        </form>
    </div>
</template>