import { runUser } from './seeders/user'
import { runCategory } from './seeders/category'
// import { runNote } from './seeders/note'
// import { runLaboratory } from './seeders/laboratory'

async function runSeeders() {
  await runUser()
  await runCategory()
  // await runNote()
  // await runLaboratory()
}

runSeeders()

