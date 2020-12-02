<template>
  <div class="d-flex flex-column align-center">
    <div class="mt-5 text-h3">
      Sign Up
    </div>
    <v-sheet width="800" class="d-flex flex-column elevation-2 pa-5 mt-5">
      <v-text-field v-model="name" label="Name" />
      <ApolloMutation
        :mutation="gql => gql`
          mutation DoStuff ($name: String!){
            CreateUser (name: $name) {
              userId,
              name
            }
          }
        `"
        :variables="{
          name
        }"
        @done="onDone"
      >
        <template v-slot="{ mutate, loading, error }">
          <v-btn class="primary align-self-center" :loading="loading" @click="loading=true; mutate()">Sign Up</v-btn>
          <p v-if="error">An error occurred: {{ error }}</p>
        </template>
      </ApolloMutation>
    </v-sheet>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  data: () => ({
    name: '',
    loading: false
  }),

  methods: {
    onDone(res) {
      this.loading = false
      this.$store.commit('setUser', res['data']['CreateUser'])
      this.$toasted.show("User created successfully!")
      this.$router.push('/')
    }
  }
}
</script>

<style lang="sass">
</style>