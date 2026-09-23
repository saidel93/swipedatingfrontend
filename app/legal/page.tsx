import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Informations légales – Swipe Québec',
  description: "Divulgation d'affiliation, avertissement, politique de confidentialité et conditions d'utilisation de Swipe Québec.",
}

const section = (title: string, children: React.ReactNode) => (
  <section style={{ marginBottom: 44 }}>
    <h2 style={{ fontSize: '1.35rem', color: 'white', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,.07)' }}>{title}</h2>
    <div style={{ color: '#9ba3af', fontSize: '.9rem', lineHeight: 1.85, fontFamily: "'Figtree',sans-serif" }}>{children}</div>
  </section>
)

export default function LegalPage() {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div className="page-header">
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 20px' }}>
          <p className="page-breadcrumb">Accueil › <span style={{ color: '#fb7185' }}>Informations légales</span></p>
          <h1>Informations légales</h1>
          <p>Transparence complète sur le fonctionnement de ce site.</p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 20px 80px' }}>

        {/* Important disclaimer box */}
        <div style={{ background: 'rgba(225,29,72,.08)', border: '1px solid rgba(225,29,72,.25)', borderRadius: 14, padding: '20px 24px', marginBottom: 40 }}>
          <p style={{ color: '#fb7185', fontWeight: 700, fontSize: '.9rem', marginBottom: 8 }}>⚠️ Avertissement important</p>
          <p style={{ color: '#9ba3af', fontSize: '.88rem', lineHeight: 1.8, fontFamily: "'Figtree',sans-serif" }}>
            Ce site est un <strong style={{ color: 'white' }}>annuaire de rencontres à caractère publicitaire</strong>. Les profils présentés sont à titre illustratif et sont destinés à vous orienter vers des plateformes de rencontres partenaires. Nous ne gérons pas de système de messagerie et nous ne facilitons <strong style={{ color: 'white' }}>aucune relation directe</strong> entre les personnes. Toute communication réelle se déroule exclusivement sur les plateformes partenaires vers lesquelles vous serez redirigé(e).
          </p>
        </div>

        {section('1. Divulgation d\'affiliation', <>
          <p style={{ marginBottom: 12 }}>
            Swipe Québec est un <strong style={{ color: 'white' }}>site d'affiliation</strong>. Cela signifie que nous percevons une <strong style={{ color: 'white' }}>commission</strong> lorsque vous cliquez sur un lien de profil et que vous vous inscrivez ou effectuez une action sur la plateforme partenaire vers laquelle vous êtes redirigé(e).
          </p>
          <p style={{ marginBottom: 12 }}>
            Ce modèle est entièrement légal et encadré par les lois canadiennes et québécoises sur la publicité et le commerce électronique. Notre rémunération n'influence en aucun cas la qualité ou la véracité des informations présentées.
          </p>
          <p>
            Tous les liens vers des plateformes partenaires sont clairement identifiés. En cliquant dessus, vous reconnaissez et acceptez ce mécanisme d'affiliation.
          </p>
        </>)}

        {section('2. Nature du site — pas de contact direct', <>
          <p style={{ marginBottom: 12 }}>
            Swipe Québec est un <strong style={{ color: 'white' }}>site vitrine</strong> et un <strong style={{ color: 'white' }}>annuaire de référencement</strong>. Nous ne sommes <strong style={{ color: 'white' }}>pas</strong> une plateforme de rencontres directes.
          </p>
          <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
            <li style={{ marginBottom: 6 }}>Nous ne proposons aucun système de messagerie intégré.</li>
            <li style={{ marginBottom: 6 }}>Nous ne stockons aucune information personnelle des membres présentés dans les profils.</li>
            <li style={{ marginBottom: 6 }}>Nous n'intervenons pas dans les échanges entre utilisateurs sur les plateformes partenaires.</li>
            <li>Les profils visibles sur ce site ont pour unique fonction de vous présenter les types de membres présents sur les plateformes partenaires.</li>
          </ul>
          <p>Pour entrer en contact avec une personne, vous devez vous inscrire sur la plateforme partenaire correspondante, en acceptant ses propres conditions d'utilisation.</p>
        </>)}

        {section('3. Réservé aux adultes (18+)', <>
          <p>Ce site est strictement réservé aux personnes majeures âgées de <strong style={{ color: 'white' }}>18 ans et plus</strong>. En naviguant sur ce site, vous confirmez avoir au moins 18 ans et être légalement autorisé(e) à accéder à ce type de contenu dans votre pays de résidence. L'accès aux mineurs est formellement interdit.</p>
        </>)}

        {section('4. Exactitude des informations', <>
          <p style={{ marginBottom: 12 }}>
            Les profils, photos et informations présentés sur ce site sont fournis à titre illustratif. Swipe Québec ne peut garantir l'exactitude, la complétude ou l'actualité de chaque profil individuel.
          </p>
          <p>Nous faisons nos meilleurs efforts pour maintenir des informations à jour et pertinentes, mais nous déclinons toute responsabilité quant aux écarts pouvant exister entre un profil présenté sur ce site et la réalité de la plateforme partenaire.</p>
        </>)}

        {section('5. Liens externes', <>
          <p>Ce site contient des liens vers des sites tiers (plateformes partenaires). Swipe Québec n'est pas responsable du contenu, des pratiques de confidentialité ou des services offerts par ces sites. Nous vous encourageons à lire attentivement les conditions d'utilisation et la politique de confidentialité de chaque plateforme avant de vous inscrire.</p>
        </>)}

        {/* Quick links to sub-pages */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginTop: 16 }}>
          {[
            { href: '/confidentialite', icon: '🔒', title: 'Politique de confidentialité', desc: 'Comment nous traitons vos données' },
            { href: '/conditions', icon: '📄', title: "Conditions d'utilisation", desc: 'Règles et conditions du site' },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: '18px 20px', textDecoration: 'none', display: 'block' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: 8 }}>{l.icon}</div>
              <div style={{ color: 'white', fontWeight: 600, fontSize: '.92rem', marginBottom: 4 }}>{l.title}</div>
              <div style={{ color: '#6b7280', fontSize: '.8rem' }}>{l.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
