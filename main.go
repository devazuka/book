package main

import (
    "log"
    "time"

    "github.com/pocketbase/dbx"
    "github.com/pocketbase/pocketbase"
    "github.com/pocketbase/pocketbase/apis"
    "github.com/pocketbase/pocketbase/core"
    "github.com/pocketbase/pocketbase/models"
    "github.com/pocketbase/pocketbase/tools/hook"
)

type Count struct{ Count int }
type Booking struct {
    Id    string
    By    string
    Type  string
    At    time.Time
    Until time.Time
}

var maxBookings = map[string]int{
    "meeting": 1,
    "booth":   2,
    "visit":   40,
}

func main() {
    app := pocketbase.New()
    var selectBookingsOverlapping *dbx.Query

    app.OnBeforeServe().Add(func(e *core.ServeEvent) error {

        selectBookingsOverlapping = app.DB().
            NewQuery(`
                SELECT count(*) as count FROM booking
                WHERE type={:type}
                  AND until > {:at}
                  AND at < {:until}
                LIMIT 2
            `).Prepare()

        if selectBookingsOverlapping.LastError != nil {
            return selectBookingsOverlapping.LastError
        }

        return nil
    })

    app.OnRecordBeforeCreateRequest().Add(func(e *core.RecordCreateEvent) error {
        collection := e.Record.Collection()
        if collection.Name != "booking" {
            return nil
        }
        user := e.HttpContext.Get(apis.ContextUserKey).(*models.User)
        admin := e.HttpContext.Get(apis.ContextAdminKey).(*models.Admin)
        if user == nil || admin == nil {
            // TODO: return the proper error, Unauthenticated user can't book
            return hook.StopPropagation
        }

        if admin == nil {
            e.Record.SetDataValue("by", user.Id)
        }

        newBooking := Booking{
            // Id:    e.Record.GetId(),
            // By:    e.Record.GetStringDataValue("by"),
            Type:  e.Record.GetStringDataValue("type"),
            At:    e.Record.GetTimeDataValue("at"),
            Until: e.Record.GetTimeDataValue("until"),
        }

        // TODO: check if money is available $$$

        overlapping := Count{}
        err := selectBookingsOverlapping.
            Bind(dbx.Params{
                "at":    newBooking.At,
                "type":  newBooking.Type,
                "until": newBooking.Until,
            }).One(&overlapping)
        if err != nil {
            return err
        }

        max := maxBookings[newBooking.Type]
        if overlapping.Count >= max {
            // TODO: return the proper error, no slot availble
            return hook.StopPropagation
        }

        return nil
    })
    if err := app.Start(); err != nil {
        log.Fatal(err)
    }
}
