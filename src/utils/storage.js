import { openDB } from 'idb'

const DB_NAME = 'workdeck-db'
const DB_VER = 1

export async function getDB(){
  return openDB(DB_NAME, DB_VER, {
    upgrade(db){
      if (!db.objectStoreNames.contains('cards')) db.createObjectStore('cards', { keyPath: 'id' })
      if (!db.objectStoreNames.contains('pending')) db.createObjectStore('pending', { keyPath: 'id' })
    }
  })
}

export async function saveCard(card){
  const db = await getDB()
  await db.put('cards', card)
}

export async function getAllCards(){
  const db = await getDB()
  return (await db.getAll('cards')) || []
}

export async function queuePendingUpload(item){
  const db = await getDB()
  await db.put('pending', item)
}

export async function getAllPending(){
  const db = await getDB()
  return (await db.getAll('pending')) || []
}

export async function removePending(id){
  const db = await getDB()
  await db.delete('pending', id)
}
