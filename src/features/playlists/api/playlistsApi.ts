import type {
    CreatePlaylistArgs,
    PlaylistData,
    PlaylistsResponse,
    UpdatePlaylistArgs
} from "@/features/playlists/api/playlistsApi.types.ts";
import {baseApi} from "@/app/api/baseApi.ts";


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
                method: 'put',
                body,
            }),
            invalidatesTags:['Playlist']
        }),
    }),
})

export const { useFetchPlaylistsQuery,useCreatePlaylistsMutation,useDeletePlaylistMutation,useUpdatePlaylistMutation } = playlistsApi