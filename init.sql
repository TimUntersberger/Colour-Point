CREATE TABLE `products` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `format` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `categorie_id` bigint(20) DEFAULT NULL,
  `minquantity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `index_products_on_categorie_id` (`categorie_id`),
  CONSTRAINT `fk_rails_21864e5ee2` FOREIGN KEY (`categorie_id`) REFERENCES `categories` (`id`)
);

CREATE TABLE `categories` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
