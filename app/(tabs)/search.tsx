import { View, Text, Image, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import useFetch from '@/services/useFetch'
import { fetchMovies } from '@/services/api'
import { images } from '@/constants/images'
import MovieCard from '@/components/MovieCard'
import { icons } from '@/constants/icons'
import SearchBar from '@/components/SearchBar'
import { updateSearchCount } from '@/services/appwrite'

const search = () => {
  const [searchQuery,setSearchQuery] = useState('')
  const {data:movies,error:moviesError,loading:moviesLoading,reset,refetch:loadMovies} = useFetch(()=>fetchMovies({query:searchQuery}),false)//rename data as movies
  // console.log(movies)
  // console.log(searchQuery)

  useEffect(()=>{
    //Debouncing to only fetch when user stops typing, not at every keystroke
     const timeoutId = setTimeout(async()=>{
       if(searchQuery.trim()){
        await loadMovies()
       }else{
        reset()
       }
     },500)

     return ()=>clearTimeout(timeoutId)
  },[searchQuery])

  useEffect(()=>{
    if(movies?.length!>0 && movies?.[0])
      updateSearchCount(searchQuery,movies[0])

  },[movies])
  return (
    <View className='flex-1 bg-primary'>
      <Image source={images.bg} className='flex-1 absolute z-0 w-full' resizeMode='cover'/>
      <FlatList
        data={movies}
        renderItem={({item})=><MovieCard {...item}/>}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 16,
          marginVertical: 16,
          paddingLeft: 20
        }}
        className="mt-2 pb-32"
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className="my-5">
              <SearchBar
                placeholder="Search for a movie"
                value={searchQuery}
                onChangeText={(text)=>setSearchQuery(text)}
              />
            </View>

            {moviesLoading && (<ActivityIndicator size="large" color="#0000ff" className='my-3'/>)}
            {moviesError && (
              <Text className='text-red-500 px-5 my-3'>
                Error:{moviesError.message}
              </Text>)}
            {
               !moviesLoading && !moviesError && searchQuery.trim() && movies?.length! >0 && (
                <Text className="text-xl text-white font-bold ml-5">
                  Search Results for{" "}
                  <Text className="text-accent">{searchQuery}</Text>
                </Text>
               )
            }
          </>
        }
        ListEmptyComponent={
          !moviesLoading && !moviesError ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchQuery.trim()
                  ? "No movies found"
                  : "Start typing to search for movies"}
              </Text>
            </View>
          ) : null
        }
      />
      <Text>search</Text>
    </View>
  )
}

export default search