<script>
import { endAt, get, getDatabase, onValue, orderByChild, query, ref, remove, startAt } from "firebase/database"
import { firebaseApp } from "../firebase"
import dateUtils from "../utils/dateUtils"

const db = getDatabase(firebaseApp)
const now = new Date()
const expensesRef = ref(db, "expenses")
const usersQuery = query(ref(db, "users"))

export default {
    data() {
        return {
            expenses: [],
            userList: [],
            users: [],
            expenseToDelete: undefined,
            loading: true,
            unsubscriber: undefined,
            months: dateUtils.monthList,
            selectedMonth: dateUtils.monthList[now.getMonth()],
            expensesQuery: query(expensesRef, orderByChild("date"), startAt(dateUtils.format(now).slice(0, 8) + '00'), endAt(dateUtils.format(now).slice(0, 8) + '31'))
        };
    },
    async mounted() {
        try {
            const response = await get(usersQuery)
            if (response.exists()) {
                this.userList = Object.values(response.val())
            }
        } catch (reason) {
            console.error(reason)
        }

        this.unsubscriber = onValue(this.expensesQuery, snapshot => {
            if (snapshot.exists()) {
                this.updateExpenses(snapshot.val())
            }
            this.loading = false
        }, (error) => {
            console.error(error)
        })
    },
    unmounted() {
        if (this.unsubscriber) {
            this.unsubscriber();
        }
    },
    watch: {
        async selectedMonth(newSelectedMonth) {
            const newMonthNumber = this.months.indexOf(newSelectedMonth)
            now.setMonth(newMonthNumber)
            const dateOfMonth = dateUtils.format(now).slice(0, 8)
            this.expensesQuery = query(expensesRef, orderByChild("date"), startAt(dateOfMonth + '00'), endAt(dateOfMonth + '31'))
            try {
                const response = await get(this.expensesQuery)
                if (response.exists()) {
                    this.updateExpenses(response.val())
                } else if (this.expenses.length > 0) {
                    this.expenses.length = 0
                    this.users.length = 0
                }
            } catch (reason) {
                console.error(reason)
            }
        }
    },
    methods: {
        updateExpenses(snapshot) {
            const expenses = []
            for (const key in snapshot) {
                expenses.push({ id: key, ...snapshot[key] })
            }
            this.expenses = expenses

            this.users = this.userList.map(user => {
                let totalExpenses = this.expenses
                    .filter(expense => expense.owner === user)
                    .map(expense => Number(expense.price))
                    .reduce((totalExpenses, expense) => totalExpenses + expense, 0)

                return {
                    name: user,
                    totalExpenses
                }
            })
        },
        getPaymentPhrase() {
            const firstUser = this.users.at(0);
            const secondUser = this.users.at(1);

            if (firstUser.totalExpenses === secondUser.totalExpenses) {
                return "Les comptes sont équilibrés."
            } else if (firstUser.totalExpenses > secondUser.totalExpenses) {
                return `${secondUser.name} doit ${Math.abs(secondUser.totalExpenses - firstUser.totalExpenses)}€.`
            } else {
                return `${firstUser.name} doit ${Math.abs(firstUser.totalExpenses - secondUser.totalExpenses)}€.`
            }
        },
        deleteExpense() {
            remove(ref(db, `expenses/${this.expenseToDelete.id}`))
                .then(async () => {
                    this.expenseToDelete = undefined
                })
                .catch(reason => {
                    console.error(reason)
                    this.expenseToDelete = undefined
                })
        }
    }
}
</script>

<template>
    <h1 class="text-3xl pb-5">Dépenses du mois</h1>
    <select id="selectedMonth" v-model="selectedMonth" class="border rounded py-1 px-2 mb-5">
        <option v-for="month in months">{{ month }}</option>
    </select>
    <div v-if="!loading" class="flex items-center mb-5">
        <div v-for="user in users" class="flex flex-col items-center border rounded px-5 py-3 mr-4">
            <span class="font-bold">{{ user.name }}</span>
            <span>{{ user.totalExpenses }}€</span>
        </div>
        <p v-if="users.length > 0" class="font-bold">{{ getPaymentPhrase() }}</p>
    </div>
    <table v-if="!loading" class="table-auto w-full mb-5">
        <thead class="border-b-2">
            <th class="text-left px-1 py-2">Nom</th>
            <th class="text-left px-1 py-2">Personne</th>
            <th class="text-left px-1 py-2">Prix</th>
        </thead>
        <tbody>
            <tr class="border-b" v-for="expense in expenses" @click="expenseToDelete = expense">
                <td class="px-1 py-2">{{expense.name}}</td>
                <td class="px-1 py-2">{{expense.owner}}</td>
                <td class="px-1 py-2">{{expense.price}}€</td>
            </tr>
        </tbody>
    </table>
    <router-link to="/expenses/new" class="bg-green-400 text-white px-5 py-2 rounded-md inline-block">
        Ajouter
    </router-link>
    <div v-if="expenseToDelete" class="fixed top-0 left-0 w-full h-full z-10 backdrop-blur-sm">
        <div class="bg-white rounded-lg my-8 mx-auto p-5 w-3/4 border-2 border-black ">
            <h2 class="text-2xl mb-5">Suppression</h2>
            <p class="mb-5">Voulez-vous supprimer la dépense de <span class="font-bold">{{ expenseToDelete.owner
            }}</span>, le <span class="font-bold">{{ expenseToDelete.date }}</span> d'un montant de <span
                    class="font-bold">{{
                    expenseToDelete.price }}€</span></p>
            <button class="bg-red-500 px-5 py-2 rounded-md text-white mr-2"
                @click="deleteExpense">Supprimer</button><button class="border-2 px-5 py-2 rounded-md"
                @click="expenseToDelete = undefined">Fermer</button>
        </div>
    </div>
</template>