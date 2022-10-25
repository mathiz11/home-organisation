<script>
import { getDatabase, onValue, push, ref, update, remove } from '@firebase/database';
import Input from '../components/Input.vue';
import { firebaseApp } from '../firebase';

const db = getDatabase(firebaseApp)
const todosRef = ref(db, "todos")

export default {
    data() {
        return {
            todoValue: "",
            todos: [],
            unsubscriber: undefined,
            todoToDelete: undefined
        }
    },
    mounted() {
        this.unsubscriber = onValue(todosRef, snapshot => {
            if (snapshot.exists()) {
                this.updateTodos(snapshot.val())
            } else if (this.todos.length) {
                this.todos = []
            }
        })
    },
    unmounted() {
        if (this.unsubscriber) {
            this.unsubscriber()
        }
    },
    methods: {
        updateTodos(snapshot) {
            const todos = []
            for (const key in snapshot) {
                todos.push({ id: key, ...snapshot[key] })
            }
            this.todos = todos
        },
        addTodo() {
            const newRef = push(todosRef).ref
            update(newRef, {
                name: this.todoValue,
                isDone: false
            })
                .then(() => { })
                .catch(reason => console.error(reason))
            this.todoValue = ""
        },
        deleteTodo() {
            remove(ref(db, `todos/${this.todoToDelete.id}`))
                .then(async () => {
                    this.todoToDelete = undefined
                })
                .catch(reason => {
                    console.error(reason)
                    this.todoToDelete = undefined
                })
        },
        handleCheck(todo) {
            update(ref(db, `todos/${todo.id}`), {
                name: todo.name,
                isDone: !todo.isDone
            })
        }
    },
    components: {
        Input
    }
}
</script>

<template>
    <h1 class="text-3xl mb-5">Liste des tâches</h1>
    <form @submit.prevent="addTodo" class="flex items-center justify-between mb-5">
        <input class="border rounded py-1 px-2 w-full mr-3" v-model="todoValue" placeholder="Faire les course" />
        <button class="bg-green-400 text-white px-5 py-2 rounded-md text-sm">Ajouter</button>
    </form>
    <div class="flex flex-col">
        <div v-for="todo in todos" class="border-b flex items-center py-2">
            <input type="checkbox" @change="handleCheck(todo)" :checked="todo.isDone" class="mr-2" />
            <span>{{ todo.name }}</span>
            <button class="ml-auto text-sm bg-red-500 text-white px-2 py-1 rounded-md"
                @click="this.todoToDelete = todo">Suppr</button>
        </div>
    </div>
    <div v-if="todoToDelete" class="fixed top-0 left-0 w-full h-full z-10 backdrop-blur-sm">
        <div class="bg-white rounded-lg my-8 mx-auto p-5 w-3/4 border-2 border-black ">
            <h2 class="text-2xl mb-5">Suppression</h2>
            <p class="mb-5">Voulez-vous supprimer la tâche <span class="font-bold">{{ todoToDelete.name }}</span></p>
            <button class="bg-red-500 px-5 py-2 rounded-md text-white mr-2"
                @click="deleteTodo">Supprimer</button><button class="border-2 px-5 py-2 rounded-md"
                @click="todoToDelete = undefined">Fermer</button>
        </div>
    </div>
</template>