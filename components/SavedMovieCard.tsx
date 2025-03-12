import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { icons } from '@/constants/icons'

const SavedMovieCard = ({title,poster_url,movie_id}) => {
  // console.log(`Movie ID: ${id}, Poster Path: ${poster_path}`);
  return (
    <View>
      <Link href={`/movie/${movie_id}`} asChild>
        <TouchableOpacity className='w-[30%]'>
          <Image
            source={{
              uri:poster_url ?  poster_url : `https://placehold.co/600x400/1a1a1a/ffffff.png`
            }}
            className='w-[27vw] h-52 rounded-lg'
            resizeMode='cover'
          />
          <Text className='text-white text-sm w-[27vw]' numberOfLines={1}>{title}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  )
}

export default SavedMovieCard