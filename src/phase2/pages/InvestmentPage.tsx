import { getProposalBundle } from '../data/loadProposalData';
import { formatMoney } from '../lib/formatMoney';
import { LineItemTable } from '../components/LineItemTable';

export function InvestmentPage() {
  const { groupSubtotals, arithmeticChecks, partialDecorSum, meta, illustrativeDerived, items } =
    getProposalBundle();
  const programmeItems = items.filter(
    (i) =>
      i.area.includes('програма') ||
      i.area.includes('Програма') ||
      i.area.includes('изпълнител') ||
      i.area.includes('Водещ') ||
      i.area.includes('коктейлна част'),
  );
  const techItems = items.filter((i) => i.area.includes('Техническо'));
  const mismatches = arithmeticChecks.filter((c) => !c.match);

  return (
    <div className="p2-page">
      <header className="p2-page-head">
        <h1 className="p2-title">Инвестиция и частични subtotal-и</h1>
        <p className="p2-lead">
          Прозрачна структура по PDF. <strong>Няма обща сума</strong> — конфигурацията (палитра, 3D mapping, програма, количества)
          не е дефинирана.
        </p>
      </header>

      <section className="p2-callout p2-callout--warn">
        <h2>Обща инвестиция</h2>
        <p>
          <strong>Не може да се определи</strong> от PDF. Липсват: избор на палитра и ефект върху цените, количества (p11),
          mutually exclusive опции (3D, водещ, шоута), potвърдена програма, неоценен обхват (photo wall, кола, мокети, торта,
          фойерверки) и reconciled p29 total.
        </p>
        <p className="p2-vat-note">{meta.vatNote}</p>
      </section>

      <section className="p2-section">
        <h2 className="p2-section__title">Subtotal-и с ясна принадлежност</h2>
        <div className="p2-subtotal-list">
          {groupSubtotals.map((g) => (
            <article key={g.label} className="p2-subtotal-card">
              <h3>{g.label}</h3>
              <p className="p2-subtotal-expr">
                {g.terms.map(([t, v]) => `${t}: ${v.toLocaleString('bg-BG')}`).join(' + ')}
              </p>
              <p className="p2-subtotal-sum">{formatMoney(g.sum)}</p>
              {g.note && <p className="p2-subtotal-note">{g.note}</p>}
              {g.derived && <span className="p2-tag">Изчислено от редове</span>}
            </article>
          ))}
        </div>
      </section>

      <section className="p2-section">
        <h2 className="p2-section__title">Частичен decor sum (не grand total)</h2>
        <article className="p2-subtotal-card">
          <h3>{partialDecorSum.label}</h3>
          <p className="p2-subtotal-expr">{partialDecorSum.expr}</p>
          <p className="p2-subtotal-sum">{formatMoney(partialDecorSum.value)}</p>
          <p className="p2-subtotal-note">{partialDecorSum.excludes}</p>
        </article>
      </section>

      {mismatches.length > 0 && (
        <section className="p2-section">
          <h2 className="p2-section__title">PDF: отпечатано vs изчислено</h2>
          <ul className="p2-mismatch-list">
            {mismatches.map((c) => (
              <li key={c.check}>
                <strong>PDF стр. {c.pdfPage}</strong> — {c.check}
                <br />
                {c.expression} = {c.computed.toLocaleString('bg-BG')}; отпечатано {c.printed.toLocaleString('bg-BG')}
                {c.difference != null && ` (разлика ${c.difference})`}
                {c.note && ` — ${c.note}`}
              </li>
            ))}
          </ul>
        </section>
      )}

      {illustrativeDerived && illustrativeDerived.length > 0 && (
        <section className="p2-section">
          <h2 className="p2-section__title">Само за ориентир (не е в PDF като total)</h2>
          {illustrativeDerived.map((row) => (
            <p key={row.label} className="p2-illustrative">
              {row.label}: {row.expr} — {Array.isArray(row.value) ? row.value.join(' / ') : row.value} €. {row.assumptions}
            </p>
          ))}
        </section>
      )}

      <section className="p2-section">
        <h2 className="p2-section__title">Техническо обезпечаване (редове от PDF)</h2>
        <LineItemTable items={techItems} />
      </section>

      <section className="p2-section">
        <h2 className="p2-section__title">Предложена програма (непотвърдена)</h2>
        <p className="p2-lead">Имената са от PDF като предложение; не се представят като резервирани артисти.</p>
        <LineItemTable items={programmeItems} />
      </section>

      <section className="p2-section">
        <h2 className="p2-section__title">Отворени въпроси</h2>
        <p>
          Пълен списък: <code>docs/phase2/open-questions.md</code> (31 точки). UI маркиран като „Проект — отворени въпроси“.
        </p>
      </section>
    </div>
  );
}
