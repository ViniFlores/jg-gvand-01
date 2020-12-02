<template>
  <div class="home">
    <h2>top picks</h2>
    <ApolloQuery
    :query='gql => gql`query{
      Movie (title: "Toy Story"){
        similarMovies{
          title
        }
      }
    }`'>
      <template v-slot="{ result: { loading, error, data } }">
        <!-- Loading -->
        <div v-if="loading" class="loading apollo">Loading...</div>

        <!-- Error -->
        <div v-else-if="error" class="error apollo">An error occurred</div>

        <!-- Result -->
        <div v-else-if="data" class="result apollo">{{ data }}</div>

        <!-- No result -->
        <div v-else class="no-result apollo">No result :(</div>
      </template>
    </ApolloQuery>
    {{name}}
    {{userId}}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',

  computed: {
    ...mapGetters(['name', 'userId'])
  }

}
</script>
