<template>
  <div class="home">
    <div class="home--section ma-5 pa-5">
      <h2 class="text-h2 font-weight-bold">top picks</h2>
      <div class="text-caption font-weight-bold mb-2">based on your ratings, MovieLens recommends these movies</div>

      <ApolloQuery
      :query='gql => gql`query {
        Movie(first: 5, orderBy: imdbRating_desc, filter: {imdbRating_not: null, poster_not: null}) {
          movieId,
          budget,
          imdbRating,
          imdbVotes,
          revenue,
          url,
          poster,
          countries,
          plot,
          runtime,
          released,
          title,
          year
        }
      }`'>
        <template v-slot="{ result: { loading, error, data } }">
          <!-- Loading -->
          <div v-if="loading" class="loading apollo">Loading...</div>

          <!-- Error -->
          <div v-else-if="error" class="error apollo">An error occurred</div>

          <!-- Result -->
          <div v-else-if="data" class="result apollo">
            <div class="d-flex flex-wrap">
              <div class="d-flex white elevation-2 flex-column mr-5 mb-5 movie-container" v-for="movie in data.Movie" :key="`movie__${movie.movieId}`">
                
                <div class="ma-2">
                  <div class="text-title primary--text">{{ movie.title }}</div>
                  <div class="secondary--text">
                    {{movie.year}}
                  </div>
                </div>

                <v-spacer />

                <v-img
                  class="movie-poster"
                  :src="movie.poster"
                />

                <v-spacer />

                <v-rating class=" white align-self-center"
                  empty-icon="mdi-star-outline"
                  full-icon="mdi-star"
                />
              </div>
            </div>

          </div>

          <!-- No result -->
          <div v-else class="no-result apollo">No result :(</div>
        </template>
      </ApolloQuery>

    </div>

    <div class="home--section ma-5 pa-5">
      <h2 class="text-h2 font-weight-bold">recent releases</h2>
      <div class="text-caption font-weight-bold mb-2">movies released in last 90 days that you haven't rated</div>

      <ApolloQuery
      deep
      :query='gql => gql`query RecentReleases($userId: ID!){
        Movie(first: 5, orderBy: year_desc, filter: {year_not: null, poster_not: null, users_rated_not: {userId: $userId}}) {
          movieId,
          budget,
          imdbRating,
          imdbVotes,
          revenue,
          url,
          poster,
          countries,
          plot,
          runtime,
          released,
          title,
          year
        }
      }`'
      :variables="{
        userId
        }"
      >
        <template v-slot="{ query, result: { loading, error, data } }">
          <!-- Loading -->
          <div v-if="loading" class="loading apollo">Loading...</div>

          <!-- Error -->
          <div v-else-if="error" class="error apollo">An error occurred</div>

          <!-- Result -->
          <div v-else-if="data" class="result apollo">
            <div class="d-flex flex-wrap">
              <div class="d-flex white elevation-1 flex-column mr-5 mb-5 movie-container" v-for="movie in data.Movie" :key="`movie__${movie.movieId}`">
                
                <div class="ma-2">
                  <div class="text-title primary--text">{{ movie.title }}</div>
                  <div class="secondary--text">
                    {{movie.year}}
                  </div>
                </div>

                <v-spacer />

                <v-img
                  class="movie-poster"
                  :src="movie.poster"
                />

                <v-spacer />

                <v-rating class=" white align-self-center"
                  empty-icon="mdi-star-outline"
                  full-icon="mdi-star"
                  @input="addRating($event, movie.movieId); query.refetch()"
                />
              </div>
            </div>

          </div>

          <!-- No result -->
          <div v-else class="no-result apollo">No result :(</div>
        </template>
      </ApolloQuery>

    </div>

    <div class="home--section ma-5 pa-5">
      <h2 class="text-h2 font-weight-bold">recomended titles</h2>
      <div class="text-caption font-weight-bold mb-2">movies released in last 90 days that you haven't rated</div>

      <ApolloQuery
      deep
      :query='gql => gql`query RecomendedTitles ($userId: ID!){
        User(userId: $userId) {
          name,
          RATED_rel {
            rating
          },
          recommendedMovies (first: 5) {
            movieId,
            budget,
            imdbRating,
            imdbVotes,
            revenue,
            url,
            poster,
            countries,
            plot,
            runtime,
            released,
            title,
            year
          }
        }
      }`'
      :variables="{
        userId
      }"
      >
        <template v-slot="{ result: { loading, error, data } }">
          <!-- Loading -->
          <div v-if="loading" class="loading apollo">Loading...</div>

          <!-- Error -->
          <div v-else-if="error" class="error apollo">An error occurred</div>

          <!-- Result -->
          <div v-else-if="data" class="result apollo">
            {{data}}
            <div class="d-flex flex-wrap">
              <div class="d-flex white elevation-1 flex-column mr-5 mb-5 movie-container" v-for="movie in data.User.recommendedMovies" :key="`movie__${movie.movieId}`">
                
                <div class="ma-2">
                  <div class="text-title primary--text">{{ movie.title }}</div>
                  <div class="secondary--text">
                    {{movie.year}}
                  </div>
                </div>

                <v-spacer />

                <v-img
                  class="movie-poster"
                  :src="movie.poster"
                />

                <v-spacer />

                <v-rating class=" white align-self-center"
                  empty-icon="mdi-star-outline"
                  full-icon="mdi-star"
                />
              </div>
            </div>

          </div>

          <!-- No result -->
          <div v-else class="no-result apollo">No result :(</div>
        </template>
      </ApolloQuery>

    </div>
    {{userId}}

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import gql from 'graphql-tag'

export default {
  name: 'Home',

  computed: {
    ...mapGetters(['name', 'userId'])
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
.movie-container
  width: 270px

.movie-poster
  object-fit: cover
  object-position: 50% 0%

.home--section
  background-color: rgb(241,241,241)
</style>