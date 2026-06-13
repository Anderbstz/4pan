import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import "dotenv/config";
import bcrypt from "bcryptjs";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create a demo user
  const passwordHash = await bcrypt.hash("test123", 10);
  const user = await prisma.user.upsert({
    where: { email: "test@migaforos.com" },
    update: {},
    create: {
      email: "test@migaforos.com",
      username: "viajero",
      displayName: "Viajero Nocturno",
      passwordHash,
    },
  });
  console.log(`  ✓ Demo user: ${user.displayName} (test@migaforos.com / test123)`);

  // Sample posts
  const posts = [
    {
      title: "Carta que nunca te mandé",
      content: `Todavía guardo el ticket del cine pegado en mi cuaderno. No sé bien por qué, si la película era regular y vos te fuiste antes de que terminaran los créditos.

Pero quedó ahí, como todo lo que no te dije. A veces las palabras se quedan atascadas en la garganta y uno las guarda en estos rincones con la esperanza de que alguien las encuentre.

Quizás algún día te cruce de nuevo y esta vez no me falte el aire. O quizás no, y esta carta se quede acá, flotando en el olvido del internet, como tantas otras cosas que nunca se dijeron.`,
      section: "CARTAS_NO_ENVIADAS" as const,
      isAnonymous: true,
    },
    {
      title: "Ruido blanco",
      content: `El silencio pesa más cuando estás solo.
Pero el ruido de la ciudad no ayuda.
Es como un grito que no se escucha,
un abrazo que no se siente.

Camino entre la multitud
y nadie me ve.
Grito en medio de la noche
y nadie me oye.

Tal vez eso sea la soledad:
no estar solo,
sino ser invisible estando rodeado de gente.`,
      section: "POESIA" as const,
      isAnonymous: true,
    },
    {
      title: "Le debía una confesión a mi viejo",
      content: `Nunca te lo dije en persona porque me ganaba el orgullo, pero acá va: tenías razón en todo lo del taller. Me acuerdo cuando me llevaste a aprender a soldar y yo me quejaba porque prefería estar jugando a la pelota. Resulta que esa habilidad me salvó el laburo el mes pasado.

También quería decirte que lloro cada vez que escucho "El día que me quieras" porque me acuerdo de cuando la tarareabas mientras arreglabas la bici de mi hermana.

Perdón por haberte dicho que no entendías nada. Entendías todo. Era yo el que no entendía un carajo.

Te quiero, viejo.`,
      section: "CONFESIONES" as const,
      isAnonymous: false,
    },
    {
      title: "El último mate",
      content: `—¿Queda un poco más?
—Ahí nomás, ya está lavado.

Eduardo dejó el mate sobre la mesa de madera y miró el fondo del termo como si ahí pudiera encontrar las palabras que no venían. Hacía cuarenta y dos años que compartía ese ritual con su hermano, y ahora el silencio pesaba más que el agua tibia.

—Mañana empiezo la quimio —dijo al fin.

El otro asintió, agarró el mate frío y lo cebó igual, nomás para no dejar la cosa así nomás.

—Entonces mañana cebás vos —respondió, y le pasó el mate.

A veces el amor no necesita más que un gesto. Un mate. Un "estoy acá". Un silencio compartido que dice todo lo que las palabras no pueden.`,
      section: "MICRORRELATOS" as const,
      isAnonymous: false,
    },
    {
      title: "No doy más",
      content: `El despertador sonó a las 6 y yo ya estaba despierto desde las 4. Otra noche en la que mi cabeza decide que es buen momento para repasar todos los errores que cometí desde 1998.

Trabajo 9 horas en un lugar que no soporto, vuelvo a un departamento donde el silencio me aplasta, y me duermo mirando el techo mientras pienso si esto es todo lo que hay.

No escribo esto para que me tiren flores. Ni para llamar la atención. Solo necesito que alguien sepa que estoy acá, que existo, que a veces pasa factura intentar seguir adelante cuando no encontrás una razón para hacerlo.

Pero bueno, ya salió el sol. Otro día. Me preparo un café y a seguir.`,
      section: "DESAHOGO" as const,
      isAnonymous: true,
    },
    {
      title: "A la luna",
      content: `Luna que me ves cada noche,
testigo de mis pasos sin destino,
guardiana de los sueños que no logro,
cómplice de este amor tan clandestino.

Si pudiera, subiría a visitarte
y dejaría en tu polvo un mensaje,
un poema que nadie va a borrar
y que cruce galaxias sin equipaje.

Pero acá estoy, mirando desde el suelo,
con el alma hecha trizas y descalza,
escribiendo versos que no tienen dueño
mientras la noche lentamente se hace calma.`,
      section: "POESIA" as const,
      isAnonymous: true,
    },
    {
      title: "Aviso para navegantes",
      content: `A la chica del subte que viaja leyendo poemas de Benedetti:

Te vi tres veces. La primera fue casualidad. La segunda, busqué tu vagón. La tercera, compré el mismo libro solo para tener una excusa para hablarte.

Nunca me animé.

Pero si alguna vez llegás a leer esto (y ojalá que sí), quiero que sepas que tu sonrisa mientras leías "Táctica y estrategia" me hizo creer que el amor a primera vista existe. O al menos, el amor a primera lectura.

Ojalá te cruce una cuarta vez. Esta prometo que hablo.

—El del saquito verde.`,
      section: "CARTAS_NO_ENVIADAS" as const,
      isAnonymous: true,
    },
    {
      title: "Mi secreto más ridículo",
      content: `Tengo 34 años, soy contador público, y todas las noches antes de dormir veo un capítulo de Caballeros del Zodiaco. Y lloro. Llora como un pendejo cuando Seiya se sacrifica por Saori.

Ahí está dicho. Ya puedo morir en paz.

Bueno, la otra confesión es que una vez en una cena de trabajo dije "soy fan de los mariscos" para caer bien y la puta empresa me terminó invitando a una cata de ostras. ODIO las ostras. Las odio con toda mi alma. Comí 12 fingiendo que me encantaban. Todavía tengo pesadillas.

Eso es todo. Gracias por leer mis vergüenzas.`,
      section: "CONFESIONES" as const,
      isAnonymous: true,
    },
    {
      title: "La mudanza del adiós",
      content: `Juntó sus cosas en dos cajas de zapatos.

En la primera iban los recuerdos: el boleto de aquel viaje a la costa, la servilleta donde ella dibujó un corazón, una foto gastada de tantos besos.

En la segunda, sus esperanzas.

Salió a la calle y se encontró con que el mundo no había cambiado. Los autos seguían pasando. La gente seguía caminando. El sol seguía calentando como si nada.

"Qué injusto", pensó, "que el mundo siga girando cuando el mío acaba de parar".

Dejó las cajas en un banco de la plaza y caminó sin mirar atrás. A veces soltar no es rendirse. Es aceptar que hay historias que terminan aunque una parte de uno quiera seguir escribiéndolas.`,
      section: "MICRORRELATOS" as const,
      isAnonymous: false,
    },
    {
      title: "Jueves a las 3am",
      content: `No sé bien qué hora es porque apagué el teléfono para no tentarme a escribirle. Hace tres semanas que terminamos y todavía siento su perfume en la almohada. En la PUTA almohada que ya lavé como cinco veces.

Me pregunto si a ella le pasa lo mismo. Si extraña nuestras charlas hasta las 2am. Si extraña cuando nos dormíamos en llamada.

Ojalá que sí. No sé bien por qué, pero ojalá que sí.

Bueno, ya fue. Me levanto, me preparo un té y finjo que soy una persona funcional que tiene su vida ordenada. Spoiler: no la tengo.

Gracias por existir, migaforos.`,
      section: "DESAHOGO" as const,
      isAnonymous: true,
    },
  ] as const;

  for (const post of posts) {
    await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        section: post.section,
        isAnonymous: post.isAnonymous,
        authorId: post.isAnonymous ? null : user.id,
      },
    });
    console.log(`  ✓ Post: "${post.title}"`);
  }

  // Add some reactions to the first post
  const firstPost = await prisma.post.findFirst({ orderBy: { createdAt: "asc" } });
  if (firstPost) {
    const emojis = ["❤️", "🔥", "😢", "💔"];
    for (const emoji of emojis) {
      await prisma.reaction.create({
        data: {
          emoji,
          userId: user.id,
          postId: firstPost.id,
        },
      }).catch(() => {}); // ignore duplicate
    }
    console.log(`  ✓ Reactions added to "${firstPost.title}"`);
  }

  // Add a couple of comments
  const thirdPost = await prisma.post.findFirst({
    where: { title: "Le debía una confesión a mi viejo" },
    orderBy: { createdAt: "asc" },
  });
  if (thirdPost) {
    const comment = await prisma.comment.create({
      data: {
        content: "Me llegó al alma, hermano. Gracias por compartir esto.",
        authorId: user.id,
        postId: thirdPost.id,
      },
    });

    await prisma.comment.create({
      data: {
        content: "A veces decirlo aunque sea acá ya es un montón. Fuerza.",
        authorId: user.id,
        postId: thirdPost.id,
        parentId: comment.id,
      },
    });
    console.log(`  ✓ Comments added`);
  }

  console.log("\n✅ Seed completado! Datos de prueba:");
  console.log("   Usuario: test@migaforos.com / test123");
  console.log("   Posts: 10");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
