import type {
    CreatePlaylistArgs,
    PlaylistData,
    PlaylistsResponse,
    UpdatePlaylistArgs
} from "@/features/playlists/api/playlistsApi.types.ts";
import {baseApi} from "@/app/api/baseApi.ts";
import type {Images} from "@/common/types";


export const playlistsApi = baseApi.injectEndpoints({
    endpoints: build => ({
        fetchPlaylists: build.query<PlaylistsResponse, void>({
            query: () => `playlists`,
            providesTags:['Playlist']
        }),
        createPlaylists: build.mutation<{data: PlaylistData }, CreatePlaylistArgs>({
            query: (body) => ({
                method: 'POST',
                url: `playlists`,
                body
            }),
            invalidatesTags:['Playlist']
        }),
        deletePlaylist: build.mutation<void,  string >({
            query: (playlistId) => ({
                method: 'DELETE',
                url: `playlists/${playlistId}`,
            }),
            invalidatesTags:['Playlist']
        }),
        updatePlaylist: build.mutation<void, { playlistId: string; body: UpdatePlaylistArgs }>({
            query: ({ playlistId, body }) => ({
                url: `playlists/${playlistId}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags:['Playlist']
        }),
        uploadPlaylistCover: build.mutation<Images, { playlistId: string; file: File }>({
            query: ({ playlistId, file }) => {
                const formData = new FormData()
                formData.append('file', file)
                return {
                    url: `playlists/${playlistId}/images/main`,
                    method: 'POST',
                    body: formData,
                }
            },
            invalidatesTags: ['Playlist'],
        }),
        deletePlaylistCover: build.mutation<void, { playlistId: string }>({
            query: ({ playlistId}) => {
                return {
                    url: `playlists/${playlistId}/images/main`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: ['Playlist'],
        }),
    }),
})

export const { useFetchPlaylistsQuery,useCreatePlaylistsMutation,useDeletePlaylistMutation,useUpdatePlaylistMutation,useUploadPlaylistCoverMutation, useDeletePlaylistCoverMutation} = playlistsApi