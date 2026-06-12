import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="footer" aria-label="Інформація про проєкт">
      <div className="container footer-content">
        <div className="footer-author">
          <p>Проєкт створив:</p>
          <p>студент IV курсу, групи ДА-22</p>
          <p>Клочай Іван Олександрович</p>
        </div>

        <nav className="footer-tech" aria-label="Використані технології">
          <a
            href="https://nestjs.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Перейти на офіційний сайт NestJS"
            title="NestJS"
          >
            <Image src="/icons/nestjs.svg" alt="" width={40} height={40} priority/>
            <span className="sr-only">NestJS</span>
          </a>

          <a
            href="https://nextjs.org/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Перейти на офіційний сайт Next.js"
            title="Next.js"
          >
            <Image src="/icons/nextjs.svg" alt="" width={40} height={40} />
            <span className="sr-only">Next.js</span>
          </a>

          <a
            href="https://www.postgresql.org/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Перейти на офіційний сайт PostgreSQL"
            title="PostgreSQL"
          >
            <Image src="/icons/postgresql.svg" alt="" width={40} height={40} />
            <span className="sr-only">PostgreSQL</span>
          </a>

          <a
            href="https://www.docker.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Перейти на офіційний сайт Docker"
            title="Docker"
          >
            <Image src="/icons/docker.svg" alt="" width={40} height={40} />
            <span className="sr-only">Docker</span>
          </a>
        </nav>
      </div>
    </footer>
  );
}