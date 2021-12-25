CREATE TABLE useractions (
    id              uuid,
    userid          uuid,
    action          text,
    createdat       timestamp,
    PRIMARY KEY ((userid), createdat)
) WITH CLUSTERING ORDER BY (createdat DESC);
