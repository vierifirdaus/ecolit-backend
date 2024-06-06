import { Router } from "express";
import { login } from "./controllers/auth/login";
import { register } from "./controllers/auth/register";
import { addSampah, deleteSampah, getAllSampah, getSampahById, updateSampah } from "./controllers/sampah/crud-sampah";
import { updateUser } from "./controllers/auth/update";
import { deleteUser } from "./controllers/auth/delete";
import { authenticationAdmin, authenticationPegawai } from "./middleware/auth";
import { read } from "./controllers/auth/read";
import { readByToken } from "./controllers/auth/getUserByToken"
import { addPengangkutan, deletePengangkutan, getAllPengangkutan, getPenganngkutanById, updatePengangkutan } from "./controllers/pengangkutan/crud-pengangkutan";
import { addPihakKetiga, deletePihakKetiga, getAllPihakKetiga, getPihakKetigaById, updatePihakKetiga } from "./controllers/pihakKetiga/crud-pihakKetiga"
import { changePassword } from "./controllers/auth/changePassword";
import { fileUpload } from "./utils/multer";
import { addSampahResidu, getAllSampahResidu, getSampahResiduById, updateSampahResidu, deleteSampahResidu } from "./controllers/sampahResidu/crud-sampah-residu";
import { addPenjualanSampah, deletePenjualanSampah, getAllPenjualanSampah, getPenjualanSampahById, updatePenjualanSampah } from "./controllers/penjualanSampah/crud-penjualan"
import { addSedekahSampah, deleteSedekahSampah, getAllSedekahSampah, getSedekahSampahById, updateSedekahSampah } from "./controllers/sedekahSampah/crud-sedekah"
import { addKolaborator, deleteKolaborator, getAllKolaborator, getKolaboratorById, updateKolaborator } from "./controllers/kolboratorQurban/crud-kolaborator"
import { getAllTagihan, updateTagihan } from "./controllers/tagihan/crud-tagihan-pengangkutan-sampah";
import { getAllLogActivity } from "./controllers/logActivity/get";
import { deleteAll, seeder, seederAdmin } from "./controllers/seeder/seeder";
import { getXlsx, syncXlsx } from "./controllers/qurban/sync-xlsx";
import { downloadSampah } from "./controllers/downloadExcel/sampah";
import { downlaodPengangkutan } from "./controllers/downloadExcel/pengangkutan";
import { getTotalPenangkutanSampahResidu } from "./controllers/tagihan/get-total-pengangkutan-sampah-residu";
import { getTotalPenangananSampah } from "./controllers/tagihan/get-total-penanganan-sampah";
import { downlaodKolaboratorQurban } from "./controllers/downloadExcel/kolaboratorQurban";
import { downloadPenjualanSampah } from "./controllers/downloadExcel/penjualanSampah";
import { downlaodQurban } from "./controllers/downloadExcel/qurban";
import { downloadSampahResidu } from "./controllers/downloadExcel/sampahResidu";
import { downloadSedekahSampah } from "./controllers/downloadExcel/sedekahSampah";
import { downloadTagihan } from "./controllers/downloadExcel/tagihan";
import { getAllQurban, getQurbanById } from "./controllers/qurban/read";
import { getTotalPemilihanMandiri } from "./controllers/tagihan/get-total-pemilahan-mandiri";
import { getCountWadah } from "./controllers/qurban/count-wadah";
import { getReportWadahKolaborator } from "./controllers/qurban/report-wadah";
import { updateQurban } from "./controllers/qurban/update";

const router = Router()

//auth
router.get("/users",authenticationAdmin,read)
router.get("/user-token",readByToken)
router.post("/login", login)
router.post("/register", register)
router.put("/update", updateUser)
router.put("/change-password",authenticationPegawai, changePassword)
router.delete("/delete/:id",authenticationAdmin, deleteUser)
//sampah
router.get("/sampah", getAllSampah)
router.get("/sampah/:id", getSampahById)
router.post("/sampah",authenticationPegawai, addSampah)
router.put("/sampah",authenticationPegawai, updateSampah)
router.delete("/sampah/:id",authenticationPegawai, deleteSampah)

//pengangkutan
router.get("/pengangkutan", getAllPengangkutan)
router.get("/pengangkutan/:id", getPenganngkutanById)
router.post("/pengangkutan",authenticationPegawai,fileUpload, addPengangkutan)
router.put("/pengangkutan",authenticationPegawai,fileUpload, updatePengangkutan)
router.delete("/pengangkutan/:id",authenticationPegawai, deletePengangkutan)

//pihak ketiga
router.get("/pihak-ketiga", getAllPihakKetiga)
router.get("/pihak-ketiga/:id", getPihakKetigaById)
router.post("/pihak-ketiga", authenticationPegawai, addPihakKetiga)
router.put("/pihak-ketiga", authenticationPegawai, updatePihakKetiga)
router.delete("/pihak-ketiga/:id", authenticationPegawai, deletePihakKetiga)

//Sampah Residu
router.get("/sampah-residu", getAllSampahResidu)
router.get("/sampah-residu/:id", getSampahResiduById)
router.post("/sampah-residu", authenticationPegawai, addSampahResidu)
router.put("/sampah-residu", authenticationPegawai, updateSampahResidu)
router.delete("/sampah-residu/:id", authenticationPegawai, deleteSampahResidu)

//penjualan sampah
router.get("/penjualan-sampah", getAllPenjualanSampah)
router.get("/penjualan-sampah/:id", getPenjualanSampahById)
router.post("/penjualan-sampah", authenticationPegawai, addPenjualanSampah)
router.put("/penjualan-sampah", authenticationPegawai, updatePenjualanSampah)
router.delete("/penjualan-sampah/:id", authenticationPegawai, deletePenjualanSampah)

//sedekah sampah
router.get("/sedekah-sampah", getAllSedekahSampah)
router.get("/sedekah-sampah/:id", getSedekahSampahById)
router.post("/sedekah-sampah", authenticationPegawai, addSedekahSampah)
router.put("/sedekah-sampah", authenticationPegawai, updateSedekahSampah)
router.delete("/sedekah-sampah/:id", authenticationPegawai, deleteSedekahSampah)

//kolaborator qurban
router.get("/kolaborator-qurban", getAllKolaborator)
router.get("/kolaborator-qurban/:id", getKolaboratorById)
router.post("/kolaborator-qurban", authenticationPegawai, addKolaborator)
router.put("/kolaborator-qurban", authenticationPegawai, updateKolaborator)
router.delete("/kolaborator-qurban/:id", authenticationPegawai, deleteKolaborator)

//tagihan
router.get("/tagihan",getAllTagihan)
router.put("/tagihan", authenticationPegawai, fileUpload, updateTagihan)

//log activity
router.get("/log-activity", authenticationAdmin, getAllLogActivity)

router.post("/seeder",seeder)
router.post("/seeder-admin",seederAdmin)
router.post("/reset-sedeer",deleteAll)

//qurban
router.get("/excel",getXlsx)
router.get("/seed-excel",syncXlsx)
router.get("/qurban",getAllQurban)
router.get("/qurban/:id",getQurbanById)
router.put("/qurban/:id",updateQurban)
router.get("/count-wadah",getCountWadah)
router.get("/report-wadah",getReportWadahKolaborator)

//download excel
router.get("/download-excel-sampah",downloadSampah)
router.get("/download-excel-pengangkutan",downlaodPengangkutan)
router.get("/download-excel-kolaborator-qurban", downlaodKolaboratorQurban)
router.get("/download-excel-penjualan-sampah", downloadPenjualanSampah)
router.get("/download-excel-qurban", downlaodQurban)
router.get("/download-excel-sampah-residu", downloadSampahResidu)
router.get("/download-excel-sedekah-sampah", downloadSedekahSampah)
router.get("/download-excel-tagihan-sampah", downloadTagihan)

// total
router.get("/total-pengangkutan-sampah-residu", getTotalPenangkutanSampahResidu)
router.get("/total-pemilihan-sampah", getTotalPemilihanMandiri)
router.get("/total-penanganan-sampah", getTotalPenangananSampah)

export default router
