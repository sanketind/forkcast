from __future__ import annotations

from statistics import mean
from typing import List, Literal

from fastapi import FastAPI
from pydantic import BaseModel


class SalesDay(BaseModel):
    date: str
    revenue: float
    orders: int
    covers: int
    hourlyOrders: List[int]


class CalendarSignal(BaseModel):
    date: str
    holidayName: str | None = None
    festivalName: str | None = None
    fastingType: str | None = None
    examPressure: Literal["low", "medium", "high"] | None = "low"
    localEventTitle: str | None = None
    localEventImpact: int | None = 0


class WeatherSignal(BaseModel):
    date: str
    condition: Literal["clear", "cloudy", "rain", "storm"]
    maxTempC: float
    rainfallMm: float


class ForecastRequest(BaseModel):
    targetDate: str
    salesHistory: List[SalesDay]
    calendar: CalendarSignal
    weather: WeatherSignal


class ForecastResponse(BaseModel):
    predictedRevenue: int
    predictedOrders: int
    confidenceLow: int
    confidenceHigh: int
    reasons: List[str]


app = FastAPI(title="Forkcast Forecast Service")


def build_multiplier(payload: ForecastRequest) -> tuple[float, List[str]]:
    multiplier = 1.0
    reasons: List[str] = []

    if payload.weather.condition == "rain":
        multiplier += 0.08
        reasons.append("Rain tends to increase delivery-friendly comfort food demand.")

    if payload.calendar.localEventImpact:
        multiplier += payload.calendar.localEventImpact * 0.03
        reasons.append("Nearby events can lift walk-in and pickup volumes.")

    if payload.calendar.examPressure == "medium":
        multiplier -= 0.03
        reasons.append("Medium exam pressure trims discretionary lunch visits.")
    elif payload.calendar.examPressure == "high":
        multiplier -= 0.08
        reasons.append("High exam pressure reduces student traffic.")

    if payload.calendar.fastingType:
        multiplier -= 0.06
        reasons.append(f"{payload.calendar.fastingType} is likely to reduce non-veg demand.")

    return max(0.75, min(multiplier, 1.45)), reasons


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/forecast", response_model=ForecastResponse)
def forecast(payload: ForecastRequest) -> ForecastResponse:
    base_revenue = mean(day.revenue for day in payload.salesHistory)
    base_orders = mean(day.orders for day in payload.salesHistory)
    multiplier, reasons = build_multiplier(payload)

    predicted_revenue = round(base_revenue * multiplier)
    predicted_orders = round(base_orders * multiplier)
    confidence_band = round(predicted_revenue * 0.12)

    return ForecastResponse(
        predictedRevenue=predicted_revenue,
        predictedOrders=predicted_orders,
        confidenceLow=predicted_revenue - confidence_band,
        confidenceHigh=predicted_revenue + confidence_band,
        reasons=reasons,
    )
