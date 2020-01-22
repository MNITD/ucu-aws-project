import {writable} from 'svelte/store'
import {omit} from 'rambda'
import {lookup} from 'mime-types'


const createStore = () => {
  const {subscribe, update} = writable({ids: [], byId: {}})

  return {
    subscribe,
    loadFiles: (files) => update(state => ({
      ids: files.sort((a, b) => a.createdAt - b.createdAt).map(f => f.fileId),
      byId: files.reduce((acc, f) => ({...acc, [f.fileId]: {...acc[f.fileId], ...f}}), state.byId),
    })),
    addFileUrl: (file) => update(state => ({
      ...state,
      byId: {
        ...state.byId,
        [file.fileId]: {
          ...state.byId[file.fileId],
          url: `data:${lookup(file.fileName)};base64,${file.file}`,
        },
      },
    })),
    deleteFile: (fileId) => update(state => ({
      ids: state.ids.filter(id => id !== fileId),
      byId: omit([fileId], state.byId),
    })),
  }
}

export const fileStore = createStore()
