<script>
import { getAuth, signOut } from '@firebase/auth';
import { firebaseApp } from '../firebase';
import store from '../store';

const auth = getAuth(firebaseApp)

export default {
    methods: {
        logout() {
            signOut(auth)
                .then(() => {
                    store.user = null
                    this.$router.push("/login")
                })
                .catch(reason => console.error(reason))
        }
    }
}
</script>

<template>
    <header class="w-full flex items-center shadow h-14 gap-5 px-4">
        <router-link to="/expenses">Dépenses</router-link>
        <router-link to="/todo">Liste</router-link>

        <div class="ml-auto">
            <button class="bg-white text-red-500 border border-red-500 px-3 py-2 rounded-md" @click="logout">Se
                déconnecter</button>
        </div>
    </header>
</template>