import { Request, Response } from "express";
import prisma from "../../data-access/db.server";
import { faker } from "@faker-js/faker";

export const seederAdmin = async(req: Request, res: Response) => {
    try {
        const admin = await prisma.user.create({
            data: {
                email: "admin@admin.com",
                name: "ADMIN",
                phoneNumber: "08123456789",
                job: "CEO",
                role: "ADMIN",
                password: "$2a$10$4LI9XMYZLhWB8RUT5ULPPuvFJS1TmFLSF9UnlcktIcUMFGyNnVScK", // password: password
            }
        })
        res.status(200).send("Seeder is working");
    }
    catch (error) {
        res.status(500).send(error);
    }
}


export const seeder = async (req: Request, res: Response) => {
    try {
        
        // seeding addmin 
        const admin = await prisma.user.create({
            data: {
                email: "admin@admin.com",
                name: "ADMIN",
                phoneNumber: "08123456789",
                job: "CEO",
                role: "ADMIN",
                password: "$2a$10$4LI9XMYZLhWB8RUT5ULPPuvFJS1TmFLSF9UnlcktIcUMFGyNnVScK", // password: password
            }
        })

        //seeding tempat sampah
        for(let i=0; i<100 ;i++){
            const tempatSampah = await prisma.tempatSampah.create({
                data: {
                    name: faker.location.city(),
                    capacity: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    lat: Math.random() * (11 - 6 + 1)+6,
                    long: Math.random() * (141 - 95 + 1)+95
                }
            })
        }

        //seeding pihak ketiga
        // {
        //     "nama_organisasi":"W4C", 
        //     "sebagai" : "kolaborator", 
        //     "start_kerjasama":"2024-01-01", 
        //     "periode_kerjasama":12, 
        //     "nama_contact_person":"agus", 
        //     "nomer_contact_person": "123", 
        //     "status":123
        // }
        
        const pihakKetiga = await prisma.pihakKetiga.create({
            data: {
                nama_organisasi: "W4C",
                sebagai: "sebagai",
                start_kerjasama: new Date("2024-01-01"), // Assigning startDate directly
                periode_kerjasama: 12,
                nama_contact_person: "agus",
                nomer_contact_person: "123",
                status: 123,
                jatah_trashbag_bulanan : 147,
                biaya_normal : 24163,
                harga_trashbag_tambahan_per_tb : 24420
            }
        })
        for (let i = 0; i < 12; i++) {
            const startOfMonth = new Date("2024-01-01");
            startOfMonth.setMonth(startOfMonth.getMonth() + i);
            const endOfMonth = new Date(startOfMonth);
            endOfMonth.setMonth(endOfMonth.getMonth() + 1);

            await prisma.tagihan.create({
                data: {
                    start: startOfMonth,
                    end: endOfMonth,
                }
            });
        }

        // seeding sampah
        for(let i=0; i<100 ;i++){
            let date = faker.date.between({ from: '2024-01-01T00:00:00.000Z', to: '2024-12-31T00:00:00.000Z' });
            const sampah = await prisma.sampah.create({
                data: {
                    date: date,
                    kaca: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    kertas: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    plastik: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    organik_sisa: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    organik_kebun: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    organik_cacah: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    residu: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    trashbag: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    total : Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                }
            })

            const hitam = Math.floor(Math.random() * (1000 - 100 + 1)) + 100
            const keterangan = ["ANGKUT","OFF","SKIP"].sort(() => Math.random() - 0.5)[0]
            const pengangkutan = await prisma.pengangkutan.create({
                data: {
                    date: date,
                    bulan: faker.date.month(),
                    pekan: faker.date.weekday(),
                    status: keterangan,
                    operator: faker.internet.userName(),
                    jam: faker.date.recent().toString(),
                    hitam: hitam,
                    surat_jalan: "https://drive.google.com/file/d/19i8MaXrGasBuJXIEkSgK7Ic8DaohnhbN/view?usp=drive_link",
                    keterangan: keterangan
                }
            })

            const tagihan = await prisma.tagihan.findFirst({
                where: {
                    start: {
                        lte: new Date(date)
                    },
                    end: {
                        gte: new Date(date)
                    }
                }
            })

            if(!tagihan){
                return res.status(400).send("Tagihan not found")
            }
            const trash_bag = tagihan.trash_bag + Number(hitam)
            const trash_bag_tambahan = tagihan.trash_bag + Number(hitam)>147 ? tagihan.trash_bag + Number(hitam)-147 : 0
            const harga_normal = 24163 * trash_bag
            const harga_tambahan = 24420 * trash_bag_tambahan
            const addTrashBag = await prisma.tagihan.update({
                where: {
                    id: tagihan.id
                },
                data: {
                    trash_bag: trash_bag,
                    trash_bag_tambahan : trash_bag_tambahan, 
                    hari_angkut: keterangan=="ANGKUT" ? tagihan.hari_angkut + 1 : tagihan.hari_angkut,
                    harga_normal : harga_normal,
                    harga_tambahan : harga_tambahan,
                    tagihan : harga_normal + harga_tambahan
                }
            })

            // sampah residu 
    //         sampah_kebun Float @default(0)
    // sampah_makanan Float @default(0)
    // kertas Float @default(0)
    // kaca Float @default(0)
    // logam Float @default(0)
    // plastik_PET Float @default(0)
    // kresek Float @default(0)
    // multilayer_plastic Float @default(0)
    // plastik_lain Float @default(0)
    // residu Float @default(0)
            const sampahResidu = await prisma.sampahResidu.create({
                data: {
                    date: date,
                    residu: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    sampah_kebun: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    sampah_makanan: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    kertas: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    kaca: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    logam: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    plastik_PET: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    kresek: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    multilayer_plastic: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    plastik_lain: Math.floor(Math.random() * (1000 - 100 + 1)) + 100
                }
            })
        }

        for(let i=0 ; i<100 ; i++){
            const penjualanSampah = await prisma.penjualanSampah.create({
                data : {
                    date: faker.date.between({ from: '2024-01-01T00:00:00.000Z', to: '2024-12-31T00:00:00.000Z' }),
                    name: faker.internet.userName(),
                    gelas_botol_plastik: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    harga_gelas_botol_plastik: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    kardus: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    harga_kardus: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    gelas_kaleng_alumunium: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    harga_gelas_kaleng_alumunium: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    bohlam: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    harga_bohlam: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    kabel_dan_tembaga: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    harga_kabel_dan_tembaga: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    koran_dan_kertas: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    harga_koran_dan_kertas: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    botol_kemasan: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    harga_botol_kemasan: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    barang_elektronik: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    harga_barang_elektronik: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    gelas_botol_kaca: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    harga_gelas_botol_kaca: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    barang_lain: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    total_harga_barang_lain: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    keterangan: "keterangan",
                    attachment: "https://drive.google.com/file/d/19i8MaXrGasBuJXIEkSgK7Ic8DaohnhbN/view?usp=drive_link"
                }
            })
        }

        // sedekah sampah
        for(let i=0 ; i<100 ; i++){
            const sedekahSampah = await prisma.sedekahSampah.create({
                data: {
                    date : faker.date.between({ from: '2024-01-01T00:00:00.000Z', to: '2024-12-31T00:00:00.000Z' }),
                    name : faker.internet.userName(),
                    gelas_botol_plastik : Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    harga_gelas_botol_plastik : Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    kardus : Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    harga_kardus : Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    gelas_kaleng_alumunium : Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    harga_gelas_kaleng_alumunium : Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    bohlam : Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    harga_bohlam : Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    kabel_dan_tembaga : Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    harga_kabel_dan_tembaga : Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    koran_dan_kertas : Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    harga_koran_dan_kertas : Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    botol_kemasan : Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    harga_botol_kemasan : Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    barang_lain : Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    total_harga_barang_lain : Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
                    keterangan : "keterangan",
                    attachment : "https://drive.google.com/file/d/19i8MaXrGasBuJXIEkSgK7Ic8DaohnhbN/view?usp=drive_link",
                    partisipan : "partisipan"

                }
            })
        }

        // kolaborator qurban
        for(let i=0 ; i<10 ; i++){
            const kolaborator = await prisma.kolaboratorQurban.create({
                data: {
                    nama_lengkap : faker.internet.userName(),
                    email : faker.internet.email(),
                    bentuk_kolab : "bentuk_kolab",
                    nama_organisasi : "nama_organisasi",
                    nomor_wa : "nomor_wa",
                    akun_instagram : "akun_instagram",
                    jenis_kolab : "jenis_kolab",
                    alamat : "alamat",
                    alamat_drop_point : "alamat_drop_point",
                    longitude : Math.random() * (1)+(-6.890560),
                    latitude : Math.random() * (1)+107.609697,
                }
            })
            const pegawai = await prisma.user.create({
                data: {
                    email: faker.internet.email(),
                    name: faker.internet.userName(),
                    phoneNumber: faker.phone.number(),
                    job: "PEGAWAI",
                    role: "PEGAWAI",
                    password: "$2a$10$4LI9XMYZLhWB8RUT5ULPPuvFJS1TmFLSF9UnlcktIcUMFGyNnVScK", // password: password
                }
            })
        }


        res.status(200).send("Seeder is working");

    } catch (error) {
        res.status(500).send(error);
    }
}

export const deleteAll = async (req: Request, res: Response) => {
    try {
        await prisma.user.deleteMany()
        await prisma.tempatSampah.deleteMany()
        await prisma.sampah.deleteMany()
        await prisma.pengangkutan.deleteMany()
        await prisma.pihakKetiga.deleteMany()
        await prisma.sampahResidu.deleteMany()
        await prisma.tagihan.deleteMany()
        await prisma.penjualanSampah.deleteMany()
        await prisma.sedekahSampah.deleteMany()
        await prisma.qurban.deleteMany()
        await prisma.kolaboratorQurban.deleteMany()
        await prisma.logActivity.deleteMany()


        res.status(200).send("Delete all data success");
    } catch (error) {
        res.status(500).send(error);
    }
}