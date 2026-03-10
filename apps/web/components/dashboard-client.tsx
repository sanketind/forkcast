"use client";

import { useState } from "react";

import type { RecommendationBundle } from "@forkcast/domain";

type Props = {
  bundle: RecommendationBundle;
  outletName: string;
};

export function DashboardClient({ bundle, outletName }: Props) {
  const [acceptedShopping, setAcceptedShopping] = useState(false);
  const [acceptedStaffing, setAcceptedStaffing] = useState(false);
  const [dismissedPromo, setDismissedPromo] = useState(false);

  return (
    <div className="grid gap-6">
      <section className="hero-card">
        <p className="eyebrow">Tomorrow for {outletName}</p>
        <h2>Do this tomorrow</h2>
        <div className="hero-metrics">
          <article>
            <span>Revenue</span>
            <strong>Rs. {bundle.forecast.predictedRevenue.toLocaleString("en-IN")}</strong>
            <small>
              Band: Rs. {bundle.forecast.confidenceLow.toLocaleString("en-IN")} - Rs.{" "}
              {bundle.forecast.confidenceHigh.toLocaleString("en-IN")}
            </small>
          </article>
          <article>
            <span>Orders</span>
            <strong>{bundle.forecast.predictedOrders}</strong>
            <small>{bundle.forecast.reasons[0]}</small>
          </article>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="panel">
          <div className="section-title">
            <div>
              <p className="eyebrow">Inventory</p>
              <h3>Shopping list</h3>
            </div>
            <button className="button secondary" onClick={() => setAcceptedShopping(true)}>
              {acceptedShopping ? "Accepted" : "Accept list"}
            </button>
          </div>
          <ul className="stack-list">
            {bundle.shoppingList.map((item) => (
              <li key={item.ingredient}>
                <strong>
                  {item.ingredient}: {item.quantityToBuy} {item.unit}
                </strong>
                <span>{item.rationale}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <div className="section-title">
            <div>
              <p className="eyebrow">Staffing</p>
              <h3>Peak-hour plan</h3>
            </div>
            <button className="button secondary" onClick={() => setAcceptedStaffing(true)}>
              {acceptedStaffing ? "Scheduled" : "Accept staffing"}
            </button>
          </div>
          <div className="metric-card">
            <strong>
              {bundle.staffing.cooksNeeded} cooks, {bundle.staffing.serviceStaffNeeded} floor staff
            </strong>
            <p>
              {bundle.staffing.shiftStartHour}:00-{bundle.staffing.shiftEndHour}:00
            </p>
            <span>{bundle.staffing.rationale}</span>
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="section-title">
          <div>
            <p className="eyebrow">Action cards</p>
            <h3>Prioritized recommendations</h3>
          </div>
          <button className="button ghost" onClick={() => setDismissedPromo(true)}>
            {dismissedPromo ? "Promo dismissed" : "Dismiss promo"}
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {bundle.actionCards.map((card) => (
            <article className="action-card" key={card.title}>
              <p className="pill">{card.category}</p>
              <h4>{card.title}</h4>
              <p>{card.explanation}</p>
              <small>{card.expectedImpact}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-title">
          <div>
            <p className="eyebrow">Why the model says this</p>
            <h3>Drivers</h3>
          </div>
        </div>
        <ul className="stack-list">
          {bundle.forecast.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
