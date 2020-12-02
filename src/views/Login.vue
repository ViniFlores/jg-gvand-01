<template>
  <div class="d-flex flex-column align-center">
    <div class="mt-5 text-h3">
      Login
    </div>
    <v-sheet width="800" class="d-flex flex-column elevation-2 pa-5 mt-5">
      <v-text-field :loading="loading" v-model="username" label="Name" />
      <v-btn class="primary align-self-center" :loading="loading" @click="loading=true; login()">Login</v-btn>
    </v-sheet>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    username: '',
    loading: false
  }),

  methods: {
    login() {
      this.$store.commit('setName', this.username)
      this.$apollo.query({
        query: gql`query FetchUser ($name: String!){
          User (name: $name){
            userId,
            name
          }
        }`,

        variables: {
          name: this.username
        }
      }).then(result => {
        console.log(result)
        if (result.data.User.length) {
          this.$toasted.show("You have successfully logged in!")
          this.$store.commit('setName', this.username)
          this.$router.push('/')
        }
        this.loading = false
      })
    }
  }
}
</script>

<style lang="sass">
</style>