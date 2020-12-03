<template lang="">
  <div class="d-flex flex-column align-center movie-section ma-5">
    <div class="text-h3">
      movie
    </div>
    <div>
      <ApolloQuery
      :query="gql => gql`query FetchMovie ($movieId: ID!, $userId: ID!) {
        Movie (movieId: $movieId) {
          movieId,
          title,
          poster,
          year,
          imdbRating,
          imdbVotes,
          users_ratings (filter: {User: {userId: $userId}}) {
            rating
          }
        }
      }`"
      :variables="{
        movieId: $route.params.id,
        userId
      }"

    >
      <template v-slot="{ result: { loading, error, data } }">
        <div class="d-flex flex-column align-center" v-if="data">
          <h2>
            {{data.Movie[0].title}}
          </h2>
          <div class="d-flex">
            <img 
            class="mr-5"
            width="200"
            :src="data.Movie[0].poster"
            />

            <v-spacer />

            <div class="d-flex flex-column">
              <div class="text-h5 font-weight-bold">
                Year: <span class="font-weight-thin">{{data.Movie[0].year}}</span>
              </div>
              <div class="text-h5 font-weight-bold">
                Rating: <span class="font-weight-thin">{{data.Movie[0].imdbRating}}</span>
              </div>
              <div class="text-h5 font-weight-bold">
                Votes: <span class="font-weight-thin">{{data.Movie[0].imdbVotes}}</span>
              </div>

              <v-spacer />
              <div class="text-h5 font-weight-light">
                Rate now
              </div>

              <v-rating
                @input="addRating($event, data.Movie[0].movieId)"
                :value="data.Movie[0].users_ratings[0]!=null ? data.Movie[0].users_ratings[0].rating : 0"
                class="mb-5"
                empty-icon="mdi-star-outline"
                full-icon="mdi-star"
              />
            </div>

          </div>
        </div>
      </template>
    </ApolloQuery>
    </div>
    <v-btn class="my-5 primary depressed" @click="$router.push('/')">
      Go Back
    </v-btn>
  </div>
</template>

<script>
import gql from "graphql-tag"
import { mapGetters } from "vuex"

export default {
  name: "Movie",

  computed: {
    ...mapGetters(['userId'])
  },

  methods: {
    addRating(event, movieId) {
      let userId = this.userId
      this.$apollo.mutate({
        mutation: gql`mutation AddRating ($userId: ID!, $movieId: ID!, $rating: Float!, $timestamp: Int!) {
          AddUserRATED_rel(from: {userId: $userId}, to: {movieId: $movieId}, data: {rating: $rating, timestamp: $timestamp}) {
            rating
          }
        }`,

        variables: {
          userId: userId,
          movieId: movieId,
          rating: event,
          timestamp: 1432423
        }
      }).then(r => {
        console.log(r)
        this.$toasted.success('Title rated successfully!')
      }).catch(e => {
        console.error(e)
        this.$toasted.error('Error rating title.')
      })
    }
  }
}
</script>

<style lang="sass">
.movie-section
  background-color: rgb(241, 241, 241)
</style>