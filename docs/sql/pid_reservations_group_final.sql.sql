-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : ven. 08 mai 2026 à 16:40
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `pid_reservations_group`
--

-- --------------------------------------------------------

--
-- Structure de la table `artists`
--

CREATE TABLE `artists` (
  `id` bigint(20) NOT NULL,
  `country` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `genre` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `paiements`
--

CREATE TABLE `paiements` (
  `id` bigint(20) NOT NULL,
  `date_paiement` datetime(6) DEFAULT NULL,
  `methode` varchar(255) DEFAULT NULL,
  `montant` double DEFAULT NULL,
  `statut` varchar(255) DEFAULT NULL,
  `reservation_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `representations`
--

CREATE TABLE `representations` (
  `id` bigint(20) NOT NULL,
  `date_heure` datetime(6) NOT NULL,
  `places_disponibles` int(11) NOT NULL,
  `spectacle_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `reservations`
--

CREATE TABLE `reservations` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `number_of_seats` int(11) NOT NULL,
  `reservation_date` datetime(6) NOT NULL,
  `status` enum('CREATED','CONFIRMED','CANCELLED') NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `representation_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `spectacles`
--

CREATE TABLE `spectacles` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `date` datetime(6) NOT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `price` double NOT NULL,
  `title` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `artist_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `artists`
--
ALTER TABLE `artists`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `paiements`
--
ALTER TABLE `paiements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_9erc027l2421nvu3rn1iadnn8` (`reservation_id`);

--
-- Index pour la table `representations`
--
ALTER TABLE `representations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKshx9egif6999dahwmxwqd2jag` (`spectacle_id`);

--
-- Index pour la table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKasl7qvdnl8b2sllt5bia4jffv` (`representation_id`),
  ADD KEY `FKb5g9io5h54iwl2inkno50ppln` (`user_id`);

--
-- Index pour la table `spectacles`
--
ALTER TABLE `spectacles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK2wuxmycomi7400atrhcchungb` (`artist_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `artists`
--
ALTER TABLE `artists`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `paiements`
--
ALTER TABLE `paiements`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `representations`
--
ALTER TABLE `representations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `spectacles`
--
ALTER TABLE `spectacles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `paiements`
--
ALTER TABLE `paiements`
  ADD CONSTRAINT `FKfltqrkjfx0d0783ix49c1lmqe` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`);

--
-- Contraintes pour la table `representations`
--
ALTER TABLE `representations`
  ADD CONSTRAINT `FKshx9egif6999dahwmxwqd2jag` FOREIGN KEY (`spectacle_id`) REFERENCES `spectacles` (`id`);

--
-- Contraintes pour la table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `FKasl7qvdnl8b2sllt5bia4jffv` FOREIGN KEY (`representation_id`) REFERENCES `representations` (`id`),
  ADD CONSTRAINT `FKb5g9io5h54iwl2inkno50ppln` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `spectacles`
--
ALTER TABLE `spectacles`
  ADD CONSTRAINT `FK2wuxmycomi7400atrhcchungb` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
