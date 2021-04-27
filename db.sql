--create extension if not exists "uuid-ossp"

--create table product (
--	id uuid primary key default uuid_generate_v4(),
--	title text not null,
--	description text,
--	price integer not null
--)

--drop table product

--insert into product (title, description, price) values
--	('Book 1', 'Description 1', 49),
--	('Book 2', 'Description 2', 28),
--	('Book 3', 'Description 3', 21),
--	('Book 4', 'Description 4', 7),
--	('Book 5', 'Description 5', 17)

--create table stock (
--	id uuid primary key default uuid_generate_v4(),
--	product_id uuid not null,
--	count integer not null,
--	foreign key ("product_id") references "product" ("id") on delete cascade
--)

-- drop table stock

--insert into stock (product_id, count) values
--	('5bcf9615-477c-463e-bd18-fa42672f20fa', 74),
--	('6cd70b10-c794-4f6e-aab6-a7ffd03857c5', 47),
--	('9adb04d6-4559-4a77-a87b-1f9e4acfc14b', 40),
--	('5281f156-b1a5-416a-bc3e-446c28d9ee3a', 8),
--	('07b37448-28ad-40ed-b61e-ff1cd557216a', 39)
