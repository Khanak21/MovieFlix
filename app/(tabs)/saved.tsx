import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchSavedMovies, getCurrentUser } from '@/services/appwrite';
import SavedMovieCard from '@/components/SavedMovieCard';

const saved = () => {
   const [movies, setMovies] = useState<any>(null);
   const [user, setUser] = useState<any>(null);

      
    useEffect(() => {
      const fetchUser = async () => {
        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData.user);
          console.log(userData.user)
        }
      };
      fetchUser();
    }, []);
      
    useEffect(() => {
      const fetchMovies = async () => {
        const res = await fetchSavedMovies(user?.$id);
        console.log(res)
        setMovies(res)
      };
      fetchMovies();
    }, [user]);
  return (
    <View className='bg-primary h-full'>
      <Text className='font-bold text-white m-4'>Saved movies</Text>
      <FlatList
      data={movies}
      renderItem={({item})=>(
        <SavedMovieCard {...item}/>
      )}
      numColumns={3}
      columnWrapperStyle={{
        justifyContent: "flex-start",
          gap: 20,
          paddingRight: 5,
          marginBottom: 10,
      }}
      className='m-4 pb-32'
      />
    </View>
  )
}

export default saved