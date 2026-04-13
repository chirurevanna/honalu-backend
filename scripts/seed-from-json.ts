import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";
import * as fs from "fs";
import * as path from "path";

const DB_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/honalu";

const DB_JSON_PATH =
  process.argv[2] ||
  path.resolve(__dirname, "../../honalu-react/db.json");

interface DbJson {
  filters: any;
  profiles: any[];
}

async function seed() {
  console.log(`Reading ${DB_JSON_PATH}...`);
  const raw = fs.readFileSync(DB_JSON_PATH, "utf-8");
  const data: DbJson = JSON.parse(raw);
  console.log(`Found ${data.profiles.length} profiles to seed.`);

  const ds = new DataSource({
    type: "postgres",
    url: DB_URL,
    synchronize: false,
    logging: false,
  });

  await ds.initialize();
  const qr = ds.createQueryRunner();

  try {
    await qr.startTransaction();

    const defaultPassword = await bcrypt.hash("Honalu@123", 10);

    for (let i = 0; i < data.profiles.length; i++) {
      const p = data.profiles[i];
      const email =
        p.basic?.email ||
        `${(p.basic?.username || `user${i}`).toLowerCase().replace(/[^a-z0-9]/g, "")}@honalu.app`;

      // Check if user already exists
      const existing = await qr.query(
        `SELECT id FROM users WHERE email = $1`,
        [email],
      );
      if (existing.length > 0) {
        console.log(`  Skipping ${email} (already exists)`);
        continue;
      }

      // Create user
      const userResult = await qr.query(
        `INSERT INTO users (email, password, "displayName", "isActive", role)
         VALUES ($1, $2, $3, true, 'user')
         RETURNING id`,
        [email, defaultPassword, p.basic?.display_name || "User"],
      );
      const userId = userResult[0].id;

      // Create profile
      const profileResult = await qr.query(
        `INSERT INTO profiles (
          "userId", status, "postedBy", membership, "isScreened", "isHidden", "memberLogin",
          "displayName", "firstName", "lastName", gender, age, "maritalStatus", "dateOfBirth",
          "phoneNumber", "photoUrl",
          religion, caste, "subCaste", "motherTongue", gotra, "religiousValues", "casteNoBar",
          country, state, district, city, "residencyStatus", "zipCode",
          education, "educationStream", college,
          occupation, industry, "workingWith", income, employer,
          "aboutMe", "personalValues",
          height, weight, complexion, "bodyType",
          diet, drink, smoke,
          "bloodGroup", "specialCases",
          family, "nativePlace", "grewUpIn", interests
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11, $12, $13, $14,
          $15, $16,
          $17, $18, $19, $20, $21, $22, $23,
          $24, $25, $26, $27, $28, $29,
          $30, $31, $32,
          $33, $34, $35, $36, $37,
          $38, $39,
          $40, $41, $42, $43,
          $44, $45, $46,
          $47, $48,
          $49, $50, $51, $52
        ) RETURNING id`,
        [
          userId,
          p.account?.status || "Active",
          p.account?.posted_by || null,
          p.account?.membership || ["Free Member"],
          p.account?.screened === "Y",
          p.account?.hidden === "Y",
          p.account?.memberlogin || null,
          p.basic?.display_name || "Unknown",
          p.basic?.first_name || null,
          p.basic?.last_name || null,
          p.basic?.gender || "Male",
          p.basic?.age ? String(p.basic.age) : null,
          p.basic?.marital_status || "Never Married",
          null, // dateOfBirth — legacy data has numeric timestamps, skip
          p.basic?.phone_number || null,
          p.basic?.photo_URL || null,
          p.doctrine?.religion || "Hindu",
          p.doctrine?.caste || "Other",
          p.doctrine?.sub_caste || null,
          p.doctrine?.mother_tongue || "Kannada",
          p.doctrine?.gotra || null,
          p.doctrine?.religious_values || null,
          p.doctrine?.caste_no_bar || null,
          p.location?.country || "India",
          p.location?.state || "",
          p.location?.district || null,
          p.location?.city || "",
          p.location?.residency_status || null,
          p.location?.zip_code || null,
          p.education?.education || null,
          p.education?.education_stream || null,
          p.education?.college_1 || null,
          p.profession?.occupation || null,
          p.profession?.industry || null,
          p.profession?.working_with || null,
          p.profession?.income || null,
          p.profession?.employer || null,
          p.trait?.about_me || null,
          p.trait?.personal_values || null,
          p.appearance?.height ? String(p.appearance.height) : null,
          p.appearance?.weight ? String(p.appearance.weight) : null,
          p.appearance?.complexion || null,
          p.appearance?.built || null,
          p.lifestyle?.diet || null,
          p.lifestyle?.drink || null,
          p.lifestyle?.smoke || null,
          p.health_info?.blood_group || null,
          p.health_info?.special_cases || null,
          p.family
            ? JSON.stringify({
                culturalValues: p.family.cultural_values,
                about: p.family.about,
                fatherProfession: p.family.father_profession,
                motherProfession: p.family.mother_profession,
                brothers: p.family.brothers,
                brothersMarried: p.family.brothers_married,
                sisters: p.family.sisters,
                sistersMarried: p.family.sisters_married,
                type: p.family.type,
                located: p.family.located,
                familyIncome: p.family.family_income,
              })
            : null,
          p.origin?.native_place || null,
          p.origin?.grewup_in || null,
          p.interests_and_more
            ? JSON.stringify({
                hobbies: p.interests_and_more.hobbies,
                interests: p.interests_and_more.interests,
                cuisine: p.interests_and_more.cuisine,
                music: p.interests_and_more.music,
                sports: p.interests_and_more.sports,
                canSpeak: p.interests_and_more.can_speak,
              })
            : null,
        ],
      );

      const profileId = profileResult[0].id;

      // Insert photos
      const photos = p.photo_details?.photos || [];
      for (let j = 0; j < photos.length; j++) {
        const ph = photos[j];
        if (!ph.medium) continue;
        await qr.query(
          `INSERT INTO photos ("profileId", url, "thumbnailUrl", "order", "isProfilePhoto", status)
           VALUES ($1, $2, $3, $4, $5, 'approved')`,
          [
            profileId,
            ph.medium,
            ph.small || null,
            ph.photo_order ?? j,
            ph.profile_photo ?? j === 0,
          ],
        );
      }

      console.log(
        `  [${i + 1}/${data.profiles.length}] ${p.basic?.display_name} (${email})`,
      );
    }

    await qr.commitTransaction();
    console.log("\nSeed complete!");
  } catch (err) {
    await qr.rollbackTransaction();
    console.error("Seed failed, rolled back:", err);
    process.exit(1);
  } finally {
    await qr.release();
    await ds.destroy();
  }
}

seed();
