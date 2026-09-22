import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Dummy auth: every seeded user shares this password so the login form
// has something real to check against.
const DEMO_PASSWORD = "password123";

const RESOURCE_TYPES = [
  "STUDY_ROOM",
  "AV_EQUIPMENT",
  "SPORTS_COURT",
  "COMMON_ROOM",
];

const BUILDINGS = [
  "Main Block",
  "Tech Park",
  "Library Wing",
  "Sports Complex",
];

async function main() {
  console.log("Resetting and seeding SpaceBook...");

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.user.deleteMany();

  // -------------------------
  // Users
  // -------------------------

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@spacebook.edu",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  const members = await Promise.all(
    Array.from({ length: 9 }).map(() =>
      prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email().toLowerCase(),
          password: passwordHash,
          role: "MEMBER",
        },
      })
    )
  );

  const allUsers = [admin, ...members];

  // -------------------------
  // Resources
  // -------------------------

  const resources = await Promise.all(
    Array.from({ length: 8 }).map((_, i) => {
      const type = faker.helpers.arrayElement(RESOURCE_TYPES);

      return prisma.resource.create({
        data: {
          name:
            faker.helpers.arrayElement([
              "Alpha",
              "Beta",
              "Orion",
              "Nova",
              "Vertex",
              "Atlas",
            ]) +
            " " +
            type.replace("_", " ") +
            " " +
            (i + 1),

          type: type,

          building: faker.helpers.arrayElement(BUILDINGS),

          capacity: faker.number.int({
            min: 2,
            max: 40,
          }),
        },
      });
    })
  );

  // -------------------------
  // Bookings
  // -------------------------

  const statuses = [
    "PENDING",
    "APPROVED",
    "CANCELLED",
  ];

  for (let i = 0; i < 30; i++) {
    const user = faker.helpers.arrayElement(members);

    const resource = faker.helpers.arrayElement(resources);

    const dayOffset = faker.number.int({
      min: 1,
      max: 14,
    });

    const startHour = faker.number.int({
      min: 8,
      max: 18,
    });

    const startTime = faker.date.soon({
      days: dayOffset,
    });

    startTime.setHours(
      startHour,
      0,
      0,
      0
    );

    const endTime = new Date(startTime);

    endTime.setHours(
      startHour + 1,
      0,
      0,
      0
    );

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,

        resourceId: resource.id,

        startTime: startTime,

        endTime: endTime,

        purpose: faker.helpers.arrayElement([
          "Group project meeting",
          "Club practice session",
          "Guest lecture rehearsal",
          "Exam prep group",
          "Workshop setup",
        ]),

        status: faker.helpers.arrayElement(statuses),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,

        action: "BOOKING_CREATED",

        meta: JSON.stringify({
          bookingId: booking.id,
          resourceId: resource.id,
        }),
      },
    });
  }

  console.log(
    `Seeded ${allUsers.length} users, ${resources.length} resources, 30 bookings.`
  );
  console.log(`\nDemo login — any seeded email, password: "${DEMO_PASSWORD}"`);
  console.log(`  Admin:  admin@spacebook.edu / ${DEMO_PASSWORD}`);
  console.log(`  Member: ${members[0].email} / ${DEMO_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
