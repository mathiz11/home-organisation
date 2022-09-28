<script>
import Input from '../components/Input.vue';
import { getDatabase, ref, push, update, query, get } from '@firebase/database';
import { firebaseApp } from '../firebase';
import store from '../store';
import dateUtils from '../utils/dateUtils';

const db = getDatabase(firebaseApp)
const usersQuery = query(ref(db, "users"))

export default {
    data() {
        return {
            name: "",
            price: "",
            date: dateUtils.format(new Date),
            owner: null,
            userList: []
        }
    },
    async mounted() {
        try {
            const response = await get(usersQuery)
            if (response.exists()) {
                this.userList = Object.values(response.val())
                this.owner = store.user.displayName
            }
        } catch (reason) {
            console.error(reason)
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
                owner: this.owner,
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
        <div class="flex flex-col mb-4">
            <label for="owner" class="my-1">Payé par</label>
            <select id="owner" v-model="owner" class="border rounded py-1 px-2">
                <option v-for="user in userList">{{ user }}</option>
            </select>
        </div>
        <button class="bg-green-400 px-5 py-2 rounded-md mt-2 text-white" :disabled="!name.trim() && !price.trim()">
            Créer
        </button>
    </form>

</template>
