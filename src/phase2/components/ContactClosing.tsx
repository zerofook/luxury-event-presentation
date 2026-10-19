import type { ProposalContactConfig } from '../types';

export function ContactClosing({ contact, placeholderBg }: { contact?: ProposalContactConfig; placeholderBg: string }) {
  const hasEmail = Boolean(contact?.email?.trim());
  const hasPhone = Boolean(contact?.phone?.trim());
  const configured = hasEmail || hasPhone;

  return (
    <section id="sledvashti-stapki" className="p2-section-block p2-contact-closing">
      <p className="p2-eyebrow">Следващи стъпки</p>
      <h2 className="p2-title">Обсъждане на предложението</h2>
      {configured ? (
        <div className="p2-contact-closing__details">
          {contact?.agencyNameBg && <p className="p2-contact-closing__agency">{contact.agencyNameBg}</p>}
          {hasEmail && (
            <p>
              <a href={contact?.mailto?.trim() || `mailto:${contact!.email}`}>{contact!.email}</a>
            </p>
          )}
          {hasPhone && (
            <p>
              <a href={`tel:${contact!.phone!.replace(/\s/g, '')}`}>{contact!.phone}</a>
            </p>
          )}
        </div>
      ) : (
        <div className="p2-contact-closing__placeholder">
          <p className="p2-lead">{placeholderBg}</p>
          <ul className="p2-contact-closing__steps">
            <li>Избор на палитра, програма и технически пакет</li>
            <li>Съгласуване на припокриващи се позиции и количества</li>
            <li>Потвърждение на артисти и финална конфигурация</li>
          </ul>
          <p className="p2-muted">Контактните данни на агенцията ще бъдат добавени тук след потвърждение от възложителя.</p>
        </div>
      )}
    </section>
  );
}
