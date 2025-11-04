import type {PlaylistData} from "@/features/playlists/api/playlistsApi.types.ts";
import defaultCover from '@/assets/img/default-playlist-cover.png'
import s from './PlaylistItem.module.css'
import {useUploadPlaylistCoverMutation} from "@/features/playlists/api/playlistsApi.ts";
import type { ChangeEvent } from 'react'
type Props = {
    playlist: PlaylistData
    deletePlaylist: (playlistId: string) => void
    editPlaylist: (playlist: PlaylistData) => void
}



export const PlaylistItem = ({ playlist, editPlaylist, deletePlaylist }: Props) => {

    const [updatePlaylist] = useUploadPlaylistCoverMutation()

    const uploadCoverHandler = (event:ChangeEvent<HTMLInputElement>) => {
      const file =  event.target.files?.length && event.target.files[0]
        if(!file) return
        updatePlaylist({ playlistId: playlist.id, file })
    }

    return (
        <div>
            <img src={defaultCover} alt="cover" width={'240px'} className={s.cover} />
            <input type={'file'} onChange={uploadCoverHandler}/>
            <div>title: {playlist.attributes.title}</div>
            <div>description: {playlist.attributes.description}</div>
            <div>userName: {playlist.attributes.user.name}</div>
            <button onClick={() => deletePlaylist(playlist.id)}>delete</button>
            <button onClick={() => editPlaylist(playlist)}>update</button>
        </div>
    )
}