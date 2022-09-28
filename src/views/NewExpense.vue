<script>
import Input from '../components/Input.vue';
import { getDatabase, ref, push, update } from '@firebase/database';
import { firebaseApp } from '../firebase';
import store from '../store';
import dateUtils from '../utils/dateUtils';

const db = getDatabase(firebaseApp)

export default {
    data() {
        return {
            name: "",
            price: "",
            date: dateUtils.format(new Date)
        }
    },
    components: {
        Input
    },
    methods: {
        async createExpense() {
            const newRef = push(ref(db, "expenses")).ref
            update(newRef, {
                date: this.date,
                name: this.name,
                price: this.price,
                owner: store.user.displayName,
            })
                .then(() => this.$router.push("/expenses"))
                .catch(reason => console.error(reason))
        }
    }
}
</script>

<template>
    <h1 class="text-3xl pb-5">Créer une dépense</h1>
    <form class="w-72" @submit.prevent="createExpense">
        <Input id="name" label="Nom" type="text" v-model="name" />
        <Input id="price" label="Prix" type="number" v-model="price" />
        <Input id="date" label="Date" type="date" v-model="date" />
        <button class="bg-green-400 px-5 py-2 rounded-md mt-2 text-white" :disabled="!name.trim() && !price.trim()">
            Créer
        </button>
    </form>

</template>
